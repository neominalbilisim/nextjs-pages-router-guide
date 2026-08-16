import type { GetServerSidePropsContext, NextApiRequest } from "next";

/**
 * Dökümandaki `getServerSideProps` örneği `nookies`'in `parseCookies(context)`
 * fonksiyonunu kullanıyor. Bu demo, ekstra bağımlılık eklemeden aynı işi
 * yapan minik bir yardımcı sağlıyor. Gerçek bir projede `nookies` ya da
 * `cookie` paketini kullanabilirsiniz.
 */
export function parseCookies(
  context: GetServerSidePropsContext | { req: NextApiRequest }
): Record<string, string> {
  const header = context.req.headers.cookie;
  if (!header) return {};

  return header.split(";").reduce<Record<string, string>>((acc, pair) => {
    const [key, ...rest] = pair.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export const SESSION_COOKIE = "session_token";

interface SerializeOptions {
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
}

/** Minimal Set-Cookie serializer (döküman `nookies` kullanıyor; burada ek
 * bağımlılık eklemeden aynı işi yapıyoruz - bkz. pages/api/login.ts). */
export function serializeCookie(
  name: string,
  value: string,
  options: SerializeOptions = {}
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  parts.push(`Path=${options.path ?? "/"}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}
