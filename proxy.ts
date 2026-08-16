import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge Middleware demo (Performance & Optimization -> Middleware bölümü).
 *
 * Not: /dashboard sayfası zaten getServerSideProps içinde auth kontrolü
 * yapıyor (bkz. pages/dashboard.tsx). Bu middleware AYNI korumayı edge'de,
 * page render'ından bile önce tekrar gösteriyor - üretimde ikisinden
 * birini tercih edersin, burada ikisi de bilinçli olarak duruyor ki
 * middleware.matcher davranışını görebilesin.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("session_token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-custom-header", "pages-router-playground");
  return response;
}

// Hangi route'larda çalışacak?
export const config = {
  matcher: ["/dashboard/:path*"],
};
