import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";

// GET /api/messages/contacts - Get only the user's saved personal contacts
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(user._id).populate(
      "contacts",
      "-password"
    );

    return NextResponse.json(currentUser?.contacts || []);
  } catch (error: any) {
    console.error("Error in getContacts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/messages/contacts - Add a contact by unique username
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const targetUsername = username.toLowerCase().trim().replace(/^@/, "");

    const targetUser = await User.findOne({ username: targetUsername }).select(
      "-password"
    );

    if (!targetUser) {
      return NextResponse.json(
        { message: `No user found with username @${targetUsername}` },
        { status: 404 }
      );
    }

    if (targetUser._id.toString() === user._id.toString()) {
      return NextResponse.json(
        { message: "You cannot add yourself as a contact" },
        { status: 400 }
      );
    }

    // Check if already in contacts
    const currentUser = await User.findById(user._id);
    const alreadyContact = currentUser?.contacts?.some(
      (contactId) => contactId.toString() === targetUser._id.toString()
    );

    if (alreadyContact) {
      return NextResponse.json(
        { message: `@${targetUsername} is already in your contacts` },
        { status: 400 }
      );
    }

    // Add targetUser to currentUser's contacts
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { contacts: targetUser._id },
    });

    return NextResponse.json(targetUser, { status: 201 });
  } catch (error: any) {
    console.error("Error in addContact:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/contacts - Remove a contact by userId
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("userId");

    if (!contactId) {
      return NextResponse.json(
        { message: "Contact userId is required" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { contacts: contactId },
    });

    return NextResponse.json({ message: "Contact removed successfully" });
  } catch (error: any) {
    console.error("Error in removeContact:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
