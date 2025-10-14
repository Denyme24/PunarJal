import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

export interface TokenPayload {
  id: string;
  organizationEmail: string;
}

export function generateToken(id: string, email: string): string {
  return (jwt.sign as any)(
    { id, organizationEmail: email },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromRequest(
  request: NextRequest
): Promise<string | null> {
  // Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Check cookies
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return token || null;
}

export async function getUserFromToken(
  token: string
): Promise<TokenPayload | null> {
  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().delete("token");
}

