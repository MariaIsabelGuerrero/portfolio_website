import jwt from "jsonwebtoken";

export interface JWTPayload {
  sub: string;
  email: string;
  name: string | null;
  role: string;
  locale?: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): JWTPayload {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is not configured");
  }

  const decoded = jwt.verify(token, secret) as JWTPayload;
  return decoded;
}
