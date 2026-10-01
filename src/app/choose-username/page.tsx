"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import PageLoader from "@/components/PageLoader";
import {
  AtSignIcon,
  CheckCircle2Icon,
  XCircleIcon,
  LoaderIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function ChooseUsernamePage() {
  const { authUser, isCheckingAuth, setUsername } = useAuthStore();
  const router = useRouter();

  const [usernameInput, setUsernameInput] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({
    checked: false,
    available: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.replace("/login");
    }
  }, [authUser, isCheckingAuth, router]);

  // Generate suggested usernames based on fullName and email
  const suggestions = useMemo(() => {
    if (!authUser) return [];
    const list: string[] = [];

    const nameParts = authUser.fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    const emailPrefix = authUser.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    if (nameParts.length >= 2) {
      list.push(`${nameParts[0]}_${nameParts[1]}`);
      list.push(`${nameParts[0]}${nameParts[1]}`);
      list.push(`${nameParts[1]}_${nameParts[0]}`);
    } else if (nameParts.length === 1) {
      list.push(nameParts[0]);
      list.push(`${nameParts[0]}_dev`);
    }

    if (emailPrefix && !list.includes(emailPrefix)) {
      list.push(emailPrefix);
    }

    // Filter valid length between 3 and 20 chars
    return Array.from(new Set(list)).filter(
      (s) => s.length >= 3 && s.length <= 20
    );
  }, [authUser]);

  // Set default suggestion on first load if user doesn't have a customized username
  useEffect(() => {
    if (authUser && !usernameInput) {
      if (authUser.username && !authUser.username.startsWith("user_")) {
        setUsernameInput(authUser.username);
      } else if (suggestions.length > 0) {
        setUsernameInput(suggestions[0]);
      }
    }
  }, [authUser, suggestions]);

  // Debounced live check for availability
  useEffect(() => {
    const clean = usernameInput.toLowerCase().trim().replace(/^@/, "");

    if (!clean) {
      setAvailability({
        checked: false,
        available: false,
        message: "",
      });
      return;
    }

    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regex.test(clean)) {
      setAvailability({
        checked: true,
        available: false,
        message: "Must be 3-20 characters (letters, numbers, underscores only)",
      });
      return;
    }

    setIsCheckingAvailability(true);
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/auth/check-username?username=${encodeURIComponent(clean)}`
        );
        setAvailability({
          checked: true,
          available: res.data.available,
          message: res.data.message,
        });
      } catch (err: any) {
        setAvailability({
          checked: true,
          available: false,
          message: "Unable to verify availability",
        });
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.toLowerCase().trim().replace(/^@/, "");
    if (!clean || !availability.available) return;

    setIsSubmitting(true);
    const success = await setUsername(clean);
    setIsSubmitting(false);

    if (success) {
      router.replace("/");
    }
  };

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!authUser) {
    return null;
  }

  const firstName = authUser.fullName.split(" ")[0] || "there";

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 z-10 min-h-[100dvh]">
      <div className="relative w-full max-w-lg my-auto">
        <BorderAnimatedContainer>
          <div className="w-full p-5 sm:p-8 md:p-10 flex flex-col items-center">
            {/* AVATAR DISPLAY */}
            <div className="relative mb-5">
              <div className="size-20 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                <img
                  src={authUser.profilePic || "/avatar.png"}
                  alt={authUser.fullName}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow">
                <SparklesIcon className="size-3.5" />
              </div>
            </div>

            {/* HEADINGS */}
            <div className="text-center mb-7">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">
                Choose your username
              </h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Welcome, <span className="text-cyan-400 font-medium">{firstName}</span>!
                Pick a unique username so your friends can search and add you to
                their personal contact book.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div>
                <label className="auth-input-label flex items-center justify-between">
                  <span>Username</span>
                  <span className="text-slate-500 text-xs font-normal">
                    {usernameInput.replace(/^@/, "").length}/20
                  </span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400 font-semibold text-lg">
                    @
                  </div>

                  <input
                    type="text"
                    value={usernameInput.replace(/^@/, "")}
                    onChange={(e) =>
                      setUsernameInput(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, "")
                          .slice(0, 20)
                      )
                    }
                    className="input pl-9 pr-10 text-slate-100 font-medium tracking-wide"
                    placeholder="your_username"
                    autoFocus
                    required
                  />

                  {/* STATUS ICON */}
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    {isCheckingAvailability ? (
                      <LoaderIcon className="w-5 h-5 text-slate-400 animate-spin" />
                    ) : availability.checked && availability.available ? (
                      <CheckCircle2Icon className="w-5 h-5 text-emerald-400" />
                    ) : availability.checked && !availability.available ? (
                      <XCircleIcon className="w-5 h-5 text-rose-400" />
                    ) : (
                      <AtSignIcon className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* AVAILABILITY FEEDBACK */}
                <div className="mt-2 min-h-[20px] text-xs">
                  {isCheckingAvailability ? (
                    <span className="text-slate-400">Checking availability...</span>
                  ) : availability.checked && availability.available ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2Icon className="w-3.5 h-3.5 inline" />
                      @{usernameInput.replace(/^@/, "")} is available!
                    </span>
                  ) : availability.checked && !availability.available ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <XCircleIcon className="w-3.5 h-3.5 inline" />
                      {availability.message}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Must be 3-20 characters (letters, numbers, underscores)
                    </span>
                  )}
                </div>
              </div>

              {/* SUGGESTIONS PILLS */}
              {suggestions.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                    <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />
                    Suggestions for you:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setUsernameInput(suggestion)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          usernameInput.replace(/^@/, "") === suggestion
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20"
                            : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        @{suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isCheckingAvailability ||
                  !availability.available ||
                  usernameInput.replace(/^@/, "").length < 3
                }
                className="auth-btn w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Confirm Username & Start Chatting
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* SKIP / CANCEL IF USER ALREADY HAD A USERNAME */}
            {authUser.hasChosenUsername && (
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-xs text-slate-400 hover:text-slate-300 underline"
                >
                  Cancel and return to chats
                </Link>
              </div>
            )}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
