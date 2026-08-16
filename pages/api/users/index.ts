import type { NextApiRequest, NextApiResponse } from "next";

export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string };
}

type UsersResponse = JsonPlaceholderUser[] | { message: string };

const JSONPLACEHOLDER_USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const upstream = await fetch(JSONPLACEHOLDER_USERS_URL);

    if (!upstream.ok) {
      return res
        .status(502)
        .json({ message: `Upstream API error: ${upstream.status}` });
    }

    const users: JsonPlaceholderUser[] = await upstream.json();
    res.status(200).json(users);
  } catch {
    res.status(502).json({ message: "Gerçek API'ye ulaşılamadı" });
  }
}
