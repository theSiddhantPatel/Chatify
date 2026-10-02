import { NextRequest, NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error(
        "Google OAuth configuration error: GOOGLE_CLIENT_ID is not set in environment variables."
      );
      return NextResponse.redirect(
        new URL("/login?error=GoogleNotConfigured", origin)
      );
    }

    const redirectUri = `${origin}/api/auth/google/callback`;

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "select_account");

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error: any) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.redirect(
      new URL("/login?error=GoogleAuthFailed", origin)
    );
  }
}
