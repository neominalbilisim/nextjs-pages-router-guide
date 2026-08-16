import type { NextApiRequest, NextApiResponse } from "next";
import { serializeCookie, SESSION_COOKIE } from "@/lib/cookies";
import { loginSchema } from "@/lib/schemas/auth";
import { findUserByEmail, verifyPassword } from "@/lib/users";
import { signSessionToken, SESSION_MAX_AGE } from "@/lib/jwt";

type LoginResponse =
  | { ok: true; user: { name: string; email: string } }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return res
      .status(400)
      .json({ ok: false, message: "Geçersiz form verisi", fieldErrors });
  }

  const { email, password } = parsed.data;
  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ ok: false, message: "E-posta veya şifre hatalı" });
  }

  const token = signSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  res.setHeader(
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })
  );

  res.status(200).json({ ok: true, user: { name: user.name, email: user.email } });
}
