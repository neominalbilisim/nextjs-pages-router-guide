import Link from "next/link";

/**
 * 404.tsx vs _error.tsx:
 * - 404.tsx SADECE bulunamayan route'lar için (bu dosya varsa build time'da
 *   statik olarak üretilir, _error.tsx'ten daha hızlıdır).
 * - _error.tsx TÜM diğer hatalar için (404 dahil, bu dosya yoksa).
 */
export default function Custom404() {
  return (
    <div className="error-box" style={{ borderColor: "var(--warn)" }}>
      <h1 style={{ marginTop: 0 }}>404 - Sayfa Bulunamadı</h1>
      <p style={{ color: "inherit" }}>Aradığınız sayfa mevcut değil.</p>
      <p style={{ color: "inherit", fontSize: 13 }}>
        Bu sayfa <code>pages/404.tsx</code> tarafından render edildi (build
        time&apos;da statik üretilir).
      </p>
      <Link href="/">← Ana sayfaya dön</Link>
    </div>
  );
}
