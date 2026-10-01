import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = (
      body.emailOrUsername ||
      body.email ||
      body.username ||
      ""
    )
      .toLowerCase()
      .trim()
      .replace(/^@/, "");

    const { password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Username/Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          message:
            "This account was created with Google. Please use 'Sign in with Google'.",
        },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = generateToken(user._id.toString());
    const response = NextResponse.json(
      {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        hasChosenUsername: Boolean(
          user.hasChosenUsername || (user.password && user.username)
        ),
      },
      { status: 200 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
