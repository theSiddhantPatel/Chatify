"use client";

import { useEffect, useState, FormEvent } from "react";
import { useChatStore } from "@/store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { UserPlusIcon, AtSignIcon, Trash2Icon, UsersIcon } from "lucide-react";

function ContactList() {
  const {
    getAllContacts,
    allContacts,
    setSelectedUser,
    isUsersLoading,
    addContact,
    removeContact,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const handleAddContact = async (e: FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSubmitting(true);
    const success = await addContact(usernameInput.trim());
    setIsSubmitting(false);

    if (success) {
      setUsernameInput("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* ADD CONTACT BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 hover:from-cyan-500/30 hover:to-cyan-600/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
      >
        <UserPlusIcon className="w-4 h-4" />
        <span>Add Contact by Username</span>
      </button>

      {/* ADD CONTACT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <UserPlusIcon className="w-5 h-5 text-cyan-400" />
              Add Contact
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Enter their unique username to add them to your private contacts book.
            </p>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="e.g. john_doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setUsernameInput("");
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !usernameInput.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Adding..." : "Add to Contacts"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTACTS LIST */}
      {isUsersLoading ? (
        <UsersLoadingSkeleton />
      ) : allContacts.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-800/20 rounded-lg border border-slate-800">
          <UsersIcon className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
          <p className="text-slate-300 text-sm font-medium">No contacts yet</p>
          <p className="text-slate-500 text-xs mt-1">
            Click &quot;Add Contact&quot; above to search and save friends by their @username.
          </p>
        </div>
      ) : (
        allContacts.map((contact) => (
          <div
            key={contact._id}
            className="group bg-cyan-500/10 p-3.5 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-all flex items-center justify-between"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3 truncate min-w-0">
              <div
                className={`avatar ${
                  onlineUsers.includes(contact._id) ? "online" : "offline"
                }`}
              >
                <div className="size-11 rounded-full">
                  <img
                    src={contact.profilePic || "/avatar.png"}
                    alt={contact.fullName}
                  />
                </div>
              </div>
              <div className="truncate">
                <h4 className="text-slate-200 font-medium text-sm truncate">
                  {contact.fullName}
                </h4>
                {contact.username && (
                  <p className="text-cyan-400/80 text-xs truncate">
                    @{contact.username}
                  </p>
                )}
              </div>
            </div>

            {/* REMOVE CONTACT BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirm(
                    `Remove ${contact.fullName} (@${contact.username}) from your contacts?`
                  )
                ) {
                  removeContact(contact._id);
                }
              }}
              title="Remove contact"
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1.5 transition-opacity"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ContactList;
