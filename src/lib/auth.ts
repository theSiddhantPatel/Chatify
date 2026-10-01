import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User, { IUserDocument } from "@/models/User";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_chatify";

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
