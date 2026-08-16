import jwt from "jsonwebtoken";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
}

export const SESSION_MAX_AGE = 60 * 60; // 1 saat (saniye)

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET env değişkeni tanımlı değil. .env.local dosyasına ekleyin."
    );
  }
  return secret;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_MAX_AGE });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string") return null;

    const { sub, email, name } = decoded as jwt.JwtPayload &
      Partial<SessionPayload>;
    if (!sub || !email || !name) return null;

    return { sub, email, name };
  } catch {
    return null;
  }
}
