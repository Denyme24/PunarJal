import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getTokenFromRequest, getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = await getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded = await getUserFromToken(token);

    if (!decoded) {
      return NextResponse.json(
        { valid: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { valid: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        _id: user._id,
        organizationName: user.organizationName,
        organizationEmail: user.organizationEmail,
        organizationType: user.organizationType,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { valid: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

