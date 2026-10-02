import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateToken, setAuthCookie, getAppOrigin } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { fullName, username, email, password } = await req.json();

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.toLowerCase().trim().replace(/^@/, "");
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

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      username: cleanUsername,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      hasChosenUsername: true,
      contacts: [],
    });

    const token = generateToken(newUser._id.toString());
    const response = NextResponse.json(
      {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        hasChosenUsername: true,
      },
      { status: 201 }
    );

    setAuthCookie(response, token);

    // Send welcome email in background
    const clientUrl = getAppOrigin(req);
    sendWelcomeEmail(newUser.email, newUser.fullName, clientUrl).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
