"use client";

import { XIcon, ArrowLeftIcon } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {/* MOBILE BACK BUTTON */}
        <button
          onClick={() => setSelectedUser(null)}
          className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 rounded-full transition-colors cursor-pointer shrink-0"
          title="Back to contacts"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className={`avatar shrink-0 ${isOnline ? "online" : "offline"}`}>
          <div className="size-10 sm:size-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-200 font-medium truncate max-w-xs">
              {selectedUser.fullName}
            </h3>
            {selectedUser.username && (
              <span className="text-xs text-cyan-400 font-normal">
                @{selectedUser.username}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)} title="Close chat">
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
