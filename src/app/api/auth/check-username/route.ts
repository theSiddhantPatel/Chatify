import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawUsername = searchParams.get("username") || "";
    const cleanUsername = rawUsername.toLowerCase().trim().replace(/^@/, "");

    if (!cleanUsername) {
      return NextResponse.json(
        { available: false, message: "Username cannot be empty" },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json(
        {
          available: false,
          message:
            "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
        },
        { status: 200 }
      );
    }

    await connectDB();
    const currentUser = await getAuthenticatedUser(req);

    const existingUser = await User.findOne({
      username: cleanUsername,
      ...(currentUser ? { _id: { $ne: currentUser._id } } : {}),
    });

    if (existingUser) {
      return NextResponse.json(
        { available: false, message: "Username is already taken" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { available: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Check username error:", error);
    return NextResponse.json(
      { available: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
