import Link from "next/link";

/**
 * pages/500.tsx sadece PRODUCTION build'de (next build && next start)
 * _error.tsx'in önüne geçer. `next dev`'de genelde hata overlay'i
 * görürsün ve bu dosya çağrılmaz - bu davranışı test etmek için
 * `npm run build && npm run start` çalıştırıp /error-page-demo'yu dene.
 */
export default function Custom500() {
  return (
    <div className="error-box">
      <h1 style={{ marginTop: 0 }}>500 - Server Hatası</h1>
      <p style={{ color: "inherit" }}>Bir şeyler ters gitti.</p>
      <p style={{ color: "inherit", fontSize: 13 }}>
        Bu sayfa <code>pages/500.tsx</code> tarafından render edildi (sadece
        production build&apos;de).
      </p>
      <Link href="/">← Ana sayfaya dön</Link>
    </div>
  );
}
