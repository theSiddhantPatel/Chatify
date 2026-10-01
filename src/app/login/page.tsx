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
  MailIcon,
  LoaderIcon,
  LockIcon,
  AlertCircleIcon,
} from "lucide-react";

function AuthErrorNotice() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  let msg = "Authentication failed. Please try again.";
  if (error === "GoogleAuthCancelled") msg = "Google sign-in was cancelled.";
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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const { login, isLoggingIn, authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.replace("/");
    }
  }, [authUser, isCheckingAuth, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (authUser) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 z-10 min-h-[100dvh]">
      <div className="relative w-full max-w-6xl min-h-[580px] md:h-[750px] lg:h-[800px] h-auto my-auto">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row h-full">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex items-center justify-center md:border-r border-slate-600/30 overflow-y-auto">
              <div className="w-full max-w-md my-auto">
                {/* HEADING TEXT */}
                <div className="text-center mb-6">
                  <MessageCircleIcon className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-1">
                    Welcome Back
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Login with your account to start chatting
                  </p>
                </div>

                <Suspense fallback={null}>
                  <AuthErrorNotice />
                </Suspense>

                {/* GOOGLE SIGN IN */}
                <GoogleAuthButton text="Sign in with Google" />

                {/* DIVIDER */}
                <div className="relative my-5 flex items-center justify-center">
                  <div className="border-t border-slate-700/80 w-full" />
                  <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider absolute">
                    or with credentials
                  </span>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* USERNAME OR EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email or Username</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.emailOrUsername}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailOrUsername: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="john_doe or john@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="auth-input-label mb-0">Password</label>
                      <Link
                        href="/forgot-password"
                        className="px-3 py-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors inline-block bg-cyan-500/10 rounded-lg shrink-0"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter your password"
                        required
                      />

                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    className="auth-btn flex items-center justify-center cursor-pointer"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">

                  <Link href="/signup" className="auth-link">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </div>
              </div>
            </div>

            {/* FORM ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain max-h-[480px]"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    Connect anytime, anywhere
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
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
