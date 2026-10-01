import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await req.json();
    const cleanUsername = (username || "").toLowerCase().trim().replace(/^@/, "");

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json(
        {
          message:
            "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      username: cleanUsername,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username is already taken. Please choose another." },
        { status: 400 }
      );
    }

    user.username = cleanUsername;
    user.hasChosenUsername = true;
    await user.save();

    return NextResponse.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      hasChosenUsername: true,
    });
  } catch (error: any) {
    console.error("Set username error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
