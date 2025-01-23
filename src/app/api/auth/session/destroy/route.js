import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookiesStore = await cookies();
    // Clear the session cookie by setting its value to an empty string and expiration to the past
    cookiesStore.set({
      name: "session_token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Expire the cookie immediately
    });
    console.log("Session destroyed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error destroying session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
