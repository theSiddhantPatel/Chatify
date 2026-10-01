import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let socketId: string | null = null;
    let channelName: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      socketId = body.socket_id;
      channelName = body.channel_name;
    } else {
      const formData = await req.formData();
      socketId = formData.get("socket_id") as string;
      channelName = formData.get("channel_name") as string;
    }

    if (!socketId || !channelName) {
      return NextResponse.json(
        { message: "socket_id and channel_name are required" },
        { status: 400 }
      );
    }

    const presenceData = {
      user_id: user._id.toString(),
      user_info: {
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
    };

    const authResponse = pusher.authorizeChannel(
      socketId,
      channelName,
      presenceData
    );

    return NextResponse.json(authResponse);
  } catch (error: any) {
    console.error("Error in pusher auth route:", error);
    return NextResponse.json(
      { message: "Pusher authorization failed" },
      { status: 500 }
    );
  }
}
