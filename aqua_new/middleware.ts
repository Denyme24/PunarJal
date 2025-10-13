import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Note: Authentication is primarily handled client-side by ProtectedRoute component
// This middleware is kept minimal to allow for better UX with client-side protection

export function middleware(request: NextRequest) {
  // Let all requests through - client-side ProtectedRoute handles auth UX
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

