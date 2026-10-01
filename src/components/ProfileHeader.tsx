"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleToggleSound = () => {
    if (typeof window !== "undefined") {
      try {
        const sound = new Audio("/sounds/mouse-click.mp3");
        sound.currentTime = 0;
        sound.play().catch((e) => console.log("Audio play failed:", e));
      } catch (err) {
        console.log("Audio err:", err);
      }
    }
    toggleSound();
  };

  if (!authUser) return null;

  return (
    <div className="p-4 sm:p-5 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-12 sm:size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div className="min-w-0">
            <h3 className="text-slate-200 font-medium text-sm max-w-[150px] truncate">
              {authUser.fullName}
            </h3>
            {authUser.username ? (
              <Link
                href="/choose-username"
                className="text-cyan-400 hover:text-cyan-300 text-xs truncate flex items-center gap-1 group/u"
                title="Change username"
              >
                <span>@{authUser.username}</span>
                <span className="text-[10px] text-slate-500 group-hover/u:text-cyan-300 transition-colors">✎</span>
              </Link>
            ) : (
              <Link
                href="/choose-username"
                className="text-amber-400 hover:text-amber-300 text-xs truncate underline"
              >
                Set username
              </Link>
            )}
            <p className="text-slate-400 text-[11px]">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
            title="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleToggleSound}
            title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
