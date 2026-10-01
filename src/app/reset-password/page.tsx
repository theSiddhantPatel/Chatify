"use client";

import { useState, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import PageLoader from "@/components/PageLoader";
import toast from "react-hot-toast";
import {
  LockIcon,
  LoaderIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  ArrowRightIcon,
} from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link. Token is missing.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successfully!");
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Link may be expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-8">
        <div className="size-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircleIcon className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Invalid Reset Link
        </h2>
        <p className="text-slate-400 text-xs mb-6">
          No security token was found in this URL. Please request a new password reset link.
        </p>
        <Link href="/forgot-password" className="auth-btn block text-center">
          Request New Link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-8">
        <div className="size-14 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2Icon className="size-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Password Updated!
        </h2>
        <p className="text-slate-400 text-xs mb-6">
          Your password has been changed successfully. Redirecting you to sign in...
        </p>
        <Link
          href="/login"
          className="auth-btn flex items-center justify-center gap-2"
        >
          Sign In Now <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="size-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <LockIcon className="size-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-1.5">
          Reset Password
        </h2>
        <p className="text-slate-400 text-xs">
          Choose a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NEW PASSWORD */}
        <div>
          <label className="auth-input-label">New Password</label>
          <div className="relative">
            <LockIcon className="auth-input-icon" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="auth-input-label">Confirm New Password</label>
          <div className="relative">
            <LockIcon className="auth-input-icon" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Re-enter your new password"
              required
              minLength={6}
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
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-900 z-10 min-h-[100dvh]">
      <div className="relative w-full max-w-md min-h-[480px] my-auto">
        <BorderAnimatedContainer>
          <div className="w-full p-5 sm:p-8 flex items-center justify-center">
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
