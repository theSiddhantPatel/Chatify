import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { IUser, IMessage } from "@/types";

interface ChatStore {
  allContacts: IUser[];
  chats: IUser[];
  messages: IMessage[];
  activeTab: "chats" | "contacts";
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (selectedUser: IUser | null) => void;
  getAllContacts: () => Promise<void>;
  addContact: (username: string) => Promise<boolean>;
  removeContact: (userId: string) => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("isSoundEnabled") || "true")
      : true,

  toggleSound: () => {
    const nextState = !get().isSoundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("isSoundEnabled", JSON.stringify(nextState));
    }
    set({ isSoundEnabled: nextState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<IUser[]>("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  addContact: async (username: string) => {
    try {
      const res = await axiosInstance.post<IUser>("/messages/contacts", {
        username,
      });
      const newContact = res.data;
      set({
        allContacts: [
          ...get().allContacts.filter((c) => c._id !== newContact._id),
          newContact,
        ],
      });
      toast.success(
        `@${newContact.username || newContact.fullName} added to contacts!`
      );
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add contact");
      return false;
    }
  },

  removeContact: async (userId: string) => {
    try {
      await axiosInstance.delete(`/messages/contacts?userId=${userId}`);
      set({
        allContacts: get().allContacts.filter((c) => c._id !== userId),
      });
      toast.success("Contact removed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove contact");
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<IUser[]>("/messages/chats");
      set({ chats: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<IMessage[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: { text?: string; image?: string }) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!selectedUser || !authUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: IMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post<IMessage>(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({
        messages: get().messages.map((m) => (m._id === tempId ? res.data : m)),
      });
    } catch (error: any) {
      set({ messages: messages.filter((m) => m._id !== tempId) });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const { userChannel } = useAuthStore.getState();
    if (!userChannel) return;

    userChannel.unbind("newMessage");

    userChannel.bind("newMessage", (newMessage: IMessage) => {
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;

      const isMessageSentFromSelectedUser =
        newMessage.senderId === currentSelectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (get().isSoundEnabled && typeof window !== "undefined") {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const { userChannel } = useAuthStore.getState();
    if (userChannel) {
      userChannel.unbind("newMessage");
    }
  },
}));
