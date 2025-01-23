import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // For accessing cookies server-side

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Await cookies() to retrieve cookies asynchronously
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token"); // Get the token from cookies

  // Public pages (don't require authentication)
  const publicPages = ["/login", "/signup", "/"];

  // If no token and trying to access private pages, redirect to login
  if (!token && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if not authenticated
  }

  // Redirect authenticated users away from public pages to /dashboard
  if (
    token &&
    (pathname === "/login" || pathname === "/signup" || pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect to dashboard if logged in
  }

  return NextResponse.next(); // Continue to the requested page if conditions are satisfied
}

// Define which routes should trigger the middleware
export const config = {
  matcher: [
    "/", // Root
    "/login",
    "/signup",
    "/dashboard/:path*", // Dashboard and its sub-paths
    "/profile/:path*", // Profile and its sub-paths
    "/settings/:path*", // Settings and its sub-paths
  ],
};
