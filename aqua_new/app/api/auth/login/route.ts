import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { organizationEmail, password } = body;

    // Validate required fields
    if (!organizationEmail || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check for user
    const user = await User.findOne({ organizationEmail }).select("+password");

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id.toString(), user.organizationEmail);

      // Set HTTP-only cookie
      setAuthCookie(token);

      return NextResponse.json({
        _id: user._id,
        organizationName: user.organizationName,
        organizationEmail: user.organizationEmail,
        organizationType: user.organizationType,
        location: user.location,
        role: user.role,
        token,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

