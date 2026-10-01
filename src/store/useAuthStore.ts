import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { getPusherClient } from "@/lib/pusher-client";
import { IUser } from "@/types";
import type { Channel } from "pusher-js";
import type Pusher from "pusher-js";

interface AuthStore {
  authUser: IUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  pusher: Pusher | null;
  presenceChannel: Channel | null;
  userChannel: Channel | null;
  onlineUsers: string[];

  checkAuth: () => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profilePic: string }) => Promise<void>;
  connectPusher: () => void;
  disconnectPusher: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  pusher: null,
  presenceChannel: null,
  userChannel: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<IUser>("/auth/check");
      set({ authUser: res.data });
      get().connectPusher();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<IUser>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectPusher();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<IUser>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectPusher();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectPusher();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put<IUser>("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Update profile failed");
    }
  },

  connectPusher: () => {
    const { authUser, pusher } = get();
    if (!authUser || pusher) return;

    const pusherClient = getPusherClient();
    if (!pusherClient) return;

    // Presence channel for online users
    const presenceChannel = pusherClient.subscribe("presence-chatify");

    presenceChannel.bind("pusher:subscription_succeeded", (members: any) => {
      set({ onlineUsers: Object.keys(members.members || {}) });
    });

    presenceChannel.bind("pusher:member_added", (member: any) => {
      set((state) => ({
        onlineUsers: Array.from(new Set([...state.onlineUsers, member.id])),
      }));
    });

    presenceChannel.bind("pusher:member_removed", (member: any) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== member.id),
      }));
    });

    // Private channel for direct messages
    const userChannel = pusherClient.subscribe(`private-user-${authUser._id}`);

    set({ pusher: pusherClient, presenceChannel, userChannel });
  },

  disconnectPusher: () => {
    const { pusher, presenceChannel, userChannel, authUser } = get();

    if (presenceChannel) {
      presenceChannel.unbind_all();
      pusher?.unsubscribe("presence-chatify");
    }

    if (userChannel && authUser) {
      userChannel.unbind_all();
      pusher?.unsubscribe(`private-user-${authUser._id}`);
    }

    if (pusher) {
      pusher.disconnect();
    }

    set({
      pusher: null,
      presenceChannel: null,
      userChannel: null,
      onlineUsers: [],
    });
  },
}));
