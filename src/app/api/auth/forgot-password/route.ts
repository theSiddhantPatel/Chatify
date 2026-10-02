import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";
import { getAppOrigin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (user) {
      // Generate secure 32-byte hex token
      const rawToken = crypto.randomBytes(32).toString("hex");

      // Store hashed token in DB for security
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      await user.save();

      const origin = getAppOrigin(req);
      const resetLink = `${origin}/reset-password?token=${rawToken}`;

      console.log("\n=======================================================");
      console.log("PASSWORD RESET LINK GENERATED FOR:", user.email);
      console.log(resetLink);
      console.log("=======================================================\n");

      await sendPasswordResetEmail(user.email, resetLink);

      return NextResponse.json({
        message:
          "If an account with that email exists, we've sent a link to reset your password. Please check your inbox.",
        resetLink: process.env.NODE_ENV !== "production" ? resetLink : undefined,
      });
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, we've sent a link to reset your password. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Failed to process forgot password request" },
      { status: 500 }
    );
  }
}
