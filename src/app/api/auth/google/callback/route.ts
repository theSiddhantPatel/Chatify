import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateToken, setAuthCookie, getAppOrigin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const origin = getAppOrigin(req);
  const redirectUri = `${origin}/api/auth/google/callback`;

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    console.error("Google OAuth callback error or user cancelled:", error);
    return NextResponse.redirect(new URL("/login?error=GoogleAuthCancelled", origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "Google OAuth callback error: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment variables."
    );
    return NextResponse.redirect(new URL("/login?error=GoogleNotConfigured", origin));
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Error exchanging Google code for token:", tokenData);
      return NextResponse.redirect(new URL("/login?error=FailedTokenExchange", origin));
    }

    // 2. Fetch user profile from Google
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      console.error("Error fetching Google profile:", profile);
      return NextResponse.redirect(new URL("/login?error=FailedProfileFetch", origin));
    }

    await connectDB();

    const normalizedEmail = profile.email.toLowerCase().trim();

    // 3. Find user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId: profile.sub }, { email: normalizedEmail }],
    });

    if (user) {
      let modified = false;
      if (!user.googleId) {
        user.googleId = profile.sub;
        modified = true;
      }
      if (!user.profilePic && profile.picture) {
        user.profilePic = profile.picture;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    } else {
      // 4. Create new user with Google profile
      const baseUsername =
        (profile.name || normalizedEmail.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 15) || "user";

      let candidate = baseUsername;
      let suffix = 1;
      while (await User.exists({ username: candidate })) {
        candidate = `${baseUsername}${suffix}`;
        suffix++;
      }

      user = await User.create({
        email: normalizedEmail,
        fullName: profile.name || "Google User",
        username: candidate,
        googleId: profile.sub,
        profilePic: profile.picture || "",
        hasChosenUsername: false,
        contacts: [],
      });
    }

    // 5. Generate JWT token and set authentication cookie
    const token = generateToken(user._id.toString());
    const needsUsername = !user.hasChosenUsername && !user.password;
    const redirectPath = needsUsername ? "/choose-username" : "/";
    const response = NextResponse.redirect(new URL(redirectPath, origin));
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error("Unexpected Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=OAuthServerError", origin));
  }
}
