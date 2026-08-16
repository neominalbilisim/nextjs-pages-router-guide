import type { NextApiRequest, NextApiResponse } from "next";

type UserData = { id: string; name: string } | { message: string };

const FAKE_USERS: Record<string, { id: string; name: string }> = {
  "1": { id: "1", name: "Ayşe Yılmaz" },
  "2": { id: "2", name: "Mehmet Demir" },
  "3": { id: "3", name: "Zeynep Kaya" },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData>
) {
  const { id } = req.query; // [id].ts -> req.query.id

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = FAKE_USERS[id];
  if (!user) {
    return res.status(404).json({ message: `User ${id} not found` });
  }

  res.status(200).json(user);
}
