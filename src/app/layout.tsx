import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "@/components/AuthInitializer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatify - Real-Time Chat App",
  description: "Connect anytime, anywhere with Chatify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-slate-900 relative flex items-center justify-center p-2 sm:p-4 overflow-x-hidden overflow-y-auto antialiased font-sans">
        {/* DECORATORS - GRID BG & GLOW SHAPES */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />

        <AuthInitializer>
          {children}
          <Toaster position="top-center" />
        </AuthInitializer>
      </body>
    </html>
  );
}
