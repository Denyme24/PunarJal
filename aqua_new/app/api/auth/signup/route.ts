import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      organizationName,
      organizationEmail,
      organizationType,
      location,
      role,
      password,
    } = body;

    // Validate required fields
    if (
      !organizationName ||
      !organizationEmail ||
      !organizationType ||
      !location ||
      !role ||
      !password
    ) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ organizationEmail });

    if (userExists) {
      return NextResponse.json(
        { message: 'Organization already registered' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      organizationName,
      organizationEmail,
      organizationType,
      location,
      role,
      password,
    });

    if (user) {
      const token = generateToken(user._id.toString(), user.organizationEmail);

      // Set HTTP-only cookie
      setAuthCookie(token);

      return NextResponse.json(
        {
          _id: user._id,
          organizationName: user.organizationName,
          organizationEmail: user.organizationEmail,
          organizationType: user.organizationType,
          location: user.location,
          role: user.role,
          token,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: 'Invalid user data' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
