import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { profilePic, username } = body;

    if (!profilePic && !username) {
      return NextResponse.json(
        { message: "No update fields provided" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    if (username) {
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

      const existing = await User.findOne({
        username: cleanUsername,
        _id: { $ne: user._id },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Username is already taken" },
          { status: 400 }
        );
      }

      updateData.username = cleanUsername;
      updateData.hasChosenUsername = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      hasChosenUsername: Boolean(
        updatedUser.hasChosenUsername ||
          (updatedUser.password && updatedUser.username)
      ),
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
