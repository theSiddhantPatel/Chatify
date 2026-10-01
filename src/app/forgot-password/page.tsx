"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import toast from "react-hot-toast";
import {
  KeyRoundIcon,
  MailIcon,
  LoaderIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      toast.success(res.data.message || "Reset link sent!");
      if (res.data.resetLink) {
        setDevResetLink(res.data.resetLink);
      }
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 z-10 min-h-[100dvh]">
      <div className="relative w-full max-w-4xl min-h-[500px] md:h-[620px] h-auto my-auto">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row h-full">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full md:w-1/2 p-5 sm:p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md my-auto">
                {/* BACK TO LOGIN */}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" />
                  Back to Login
                </Link>

                {isSubmitted ? (
                  <div className="text-center py-6">
                    <div className="size-14 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2Icon className="size-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">
                      Check your email
                    </h2>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      If an account exists for{" "}
                      <span className="text-cyan-300 font-medium">{email}</span>
                      , we have sent a secure link to reset your password.
                    </p>

                    {devResetLink && (
                      <div className="my-4 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-left">
                        <p className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                          🛠️ Local Development Quick Link:
                        </p>
                        <a
                          href={devResetLink}
                          className="text-xs text-cyan-300 hover:underline break-all block"
                        >
                          Click here to open reset password page →
                        </a>
                      </div>
                    )}

                    <Link href="/login" className="auth-btn block text-center mt-4">
                      Return to Sign In
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* HEADING TEXT */}
                    <div className="text-center mb-6">
                      <div className="size-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <KeyRoundIcon className="size-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-200 mb-1.5">
                        Forgot Password?
                      </h2>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Enter your registered email address and we&apos;ll send you a link to reset your password.
                      </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="auth-input-label">Email Address</label>
                        <div className="relative">
                          <MailIcon className="auth-input-icon" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <button
                        className="auth-btn flex items-center justify-center cursor-pointer mt-4"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <LoaderIcon className="w-5 h-5 animate-spin" />
                        ) : (
                          "Send Reset Link"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div className="text-center max-w-sm">
                <img
                  src="/login.png"
                  alt="Security Illustration"
                  className="w-full h-auto object-contain max-h-[320px] mx-auto opacity-80"
                />
                <h3 className="text-lg font-medium text-cyan-400 mt-4">
                  Account Recovery
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Reset links are valid for 1 hour to keep your account safe and secure.
                </p>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
