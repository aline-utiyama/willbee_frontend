import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Get and set cookies

export async function POST(req) {
  try {
    const { token } = await req.json(); // Parse the request body

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    // Set the session cookie using cookies() from "next/headers"
    const cookiesStore = await cookies();
    cookiesStore.set({
      name: "session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    const response = NextResponse.json({ success: true });
    response.headers.append("Set-Cookie", cookiesStore);
    return response;
  } catch (error) {
    console.error("Error in session creation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
