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

    const { profilePic } = await req.json();
    if (!profilePic) {
      return NextResponse.json(
        { message: "Profile picture is required" },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
