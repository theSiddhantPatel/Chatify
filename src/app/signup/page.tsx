"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import PageLoader from "@/components/PageLoader";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  AtSignIcon,
  LoaderIcon,
  AlertCircleIcon,
} from "lucide-react";

function AuthErrorNotice() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  let msg = "Authentication failed. Please try again.";
  if (error === "GoogleAuthCancelled") msg = "Google sign-up was cancelled.";
  if (error === "GoogleNotConfigured")
    msg = "Google OAuth is not configured on the server.";
  if (error === "FailedTokenExchange" || error === "FailedProfileFetch")
    msg = "Could not verify your Google account.";

  return (
    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center flex items-center justify-center gap-2">
      <AlertCircleIcon className="w-4 h-4 shrink-0" />
      <span>{msg}</span>
    </div>
  );
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp, authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.replace("/");
    }
  }, [authUser, isCheckingAuth, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signup({
      ...formData,
      username: formData.username.toLowerCase().trim().replace(/^@/, ""),
    });
  };

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (authUser) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 z-10 min-h-[100dvh]">
      <div className="relative w-full max-w-6xl min-h-[640px] md:h-[750px] lg:h-[800px] h-auto my-auto">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row h-full">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex items-center justify-center md:border-r border-slate-600/30 overflow-y-auto">
              <div className="w-full max-w-md my-auto py-2">
                {/* HEADING TEXT */}
                <div className="text-center mb-5">
                  <MessageCircleIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-1">
                    Create Account
                  </h2>
                  <p className="text-slate-400 text-xs">
                    Sign up to start chatting with your contacts
                  </p>
                </div>

                <Suspense fallback={null}>
                  <AuthErrorNotice />
                </Suspense>

                {/* GOOGLE SIGN UP */}
                <GoogleAuthButton text="Sign up with Google" />

                {/* DIVIDER */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-slate-700/80 w-full" />
                  <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider absolute">
                    or with email
                  </span>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* USERNAME */}
                  <div>
                    <label className="auth-input-label">Username</label>
                    <div className="relative">
                      <AtSignIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                          })
                        }
                        className="input"
                        placeholder="john_doe"
                        required
                        minLength={3}
                        maxLength={20}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Unique identifier others use to add you to their contacts.
                    </span>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="johndoe@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn flex items-center justify-center cursor-pointer mt-2"
                    type="submit"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <Link href="/login" className="auth-link">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain max-h-[460px]"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Your Private Contact Book
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto">
                    Add friends with their unique username and chat securely.
                  </p>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Private</span>
                    <span className="auth-badge">Encrypted</span>
                    <span className="auth-badge">Pusher RTC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
