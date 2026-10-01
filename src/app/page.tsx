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
    if (!isCheckingAuth && !authUser) {
      router.replace("/login");
    }
  }, [authUser, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl h-[800px] z-10">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700/50">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
