"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";

import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import ProfileHeader from "@/components/ProfileHeader";
import ActiveTabSwitch from "@/components/ActiveTabSwitch";
import ChatsList from "@/components/ChatsList";
import ContactList from "@/components/ContactList";
import ChatContainer from "@/components/ChatContainer";
import NoConversationPlaceholder from "@/components/NoConversationPlaceholder";
import PageLoader from "@/components/PageLoader";

export default function HomePage() {
  const { authUser, isCheckingAuth } = useAuthStore();
  const { activeTab, selectedUser } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!authUser) {
        router.replace("/login");
      } else if (!authUser.hasChosenUsername) {
        router.replace("/choose-username");
      }
    }
  }, [authUser, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] md:h-[800px] max-h-[900px] z-10">
      <BorderAnimatedContainer>
        {/* LEFT SIDE - CONTACTS / CHATS */}
        <div
          className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex-col border-r border-slate-700/50 h-full shrink-0 ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE - ACTIVE CHAT */}
        <div
          className={`flex-1 flex-col bg-slate-900/50 backdrop-blur-sm overflow-hidden h-full ${
            selectedUser ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
