import type { NextApiRequest, NextApiResponse } from "next";
import { parseCookies, SESSION_COOKIE } from "@/lib/cookies";
import { verifySessionToken } from "@/lib/jwt";

type MeResponse =
  | { ok: true; user: { name: string; email: string } }
  | { ok: false };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse>
) {
  const cookies = parseCookies({ req });
  const token = cookies[SESSION_COOKIE];
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    return res.status(200).json({ ok: false });
  }

  res
    .status(200)
    .json({ ok: true, user: { name: session.name, email: session.email } });
}
