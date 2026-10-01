import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import Message from "@/models/Message";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: receiverId } = await context.params;
    const { text, image } = await req.json();
    const senderId = user._id;

    if (!text && !image) {
      return NextResponse.json(
        { message: "Text or image is required." },
        { status: 400 }
      );
    }

    if (senderId.toString() === receiverId) {
      return NextResponse.json(
        { message: "Cannot send messages to yourself." },
        { status: 400 }
      );
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return NextResponse.json(
        { message: "Receiver not found." },
        { status: 404 }
      );
    }

    let imageUrl: string | undefined;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Send real-time notification to receiver via Pusher
    try {
      await pusher.trigger(
        `private-user-${receiverId}`,
        "newMessage",
        newMessage
      );
    } catch (pusherError: any) {
      console.error("Pusher trigger error:", pusherError.message);
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Error in sendMessage route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
