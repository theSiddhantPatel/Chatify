import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User, { IUserDocument } from "@/models/User";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_pingora";

interface TokenPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("jwt", token, {
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getAuthenticatedUser(req: NextRequest): Promise<IUserDocument | null> {
  try {
    const token = req.cookies.get("jwt")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (!decoded || !decoded.userId) return null;

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    return user;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export function getAppOrigin(req: NextRequest): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  try {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto");

    if (forwardedHost) {
      const host = forwardedHost.split(",")[0].trim();
      const proto = forwardedProto
        ? forwardedProto.split(",")[0].trim()
        : host.startsWith("localhost")
        ? "http"
        : "https";
      return `${proto}://${host}`;
    }

    if (req.nextUrl && req.nextUrl.origin && !req.nextUrl.origin.includes("undefined")) {
      return req.nextUrl.origin;
    }
  } catch (err) {
    console.error("Error resolving app origin:", err);
  }

  return "http://localhost:3000";
}
