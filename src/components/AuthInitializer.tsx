"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
