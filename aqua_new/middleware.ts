import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// Paths that require authentication
const protectedPaths = [
  "/simulation",
  "/dashboard",
  "/iot-sensors",
  "/reuse",
  "/analytics",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get token from cookie or Authorization header
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Redirect to home if no token
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      // Redirect to home if token is invalid
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/simulation/:path*",
    "/dashboard/:path*",
    "/iot-sensors/:path*",
    "/reuse/:path*",
    "/analytics/:path*",
  ],
};

