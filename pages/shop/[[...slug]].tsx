import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Optional catch-all route: pages/shop/[[...slug]].tsx (çift köşeli parantez!)
 *
 * Eşleşenler:
 *  /shop               -> slug = undefined
 *  /shop/erkek         -> slug = ["erkek"]
 *  /shop/erkek/ayakkabi -> slug = ["erkek", "ayakkabi"]
 *
 * Sıradan catch-all'dan ([...slug].tsx) farkı: segment olmadan da
 * (kök path) eşleşir. Bu yüzden pages/shop/index.tsx'e gerek kalmaz -
 * bu tek dosya hem /shop'u hem alt kategorilerini karşılar.
 */
export default function ShopOptionalCatchAll() {
  const router = useRouter();
  const slug = router.query.slug;
  const segments = Array.isArray(slug) ? slug : [];

  return (
    <div>
      <Head>
        <title>{segments.length ? `Shop / ${segments.join(" / ")}` : "Shop"}</title>
      </Head>
      <span className="badge">Optional catch-all route</span>
      <h1>{segments.length ? `Shop / ${segments.join(" / ")}` : "Shop (kök)"}</h1>
      <p className="lede">
        Dosya: <code>pages/shop/[[...slug]].tsx</code>. Hem{" "}
        <code>/shop</code> hem <code>/shop/herhangi/bir/derinlik</code>{" "}
        aynı dosyaya düşer.
      </p>

      <div className="card">
        <div className="kv">
          <dt>router.query.slug</dt>
          <dd>{JSON.stringify(slug ?? null)}</dd>
          <dt>segments</dt>
          <dd>{segments.length ? segments.join(" > ") : "(kök — /shop)"}</dd>
        </div>
      </div>

      <h2>Kategorilerde gezin</h2>
      <ul className="route-list">
        <li>
          <Link href="/shop">/shop (kök)</Link>
        </li>
        <li>
          <Link href="/shop/erkek">/shop/erkek</Link>
        </li>
        <li>
          <Link href="/shop/erkek/ayakkabi">/shop/erkek/ayakkabi</Link>
        </li>
        <li>
          <Link href="/shop/kadin/canta/deri">/shop/kadin/canta/deri</Link>
        </li>
      </ul>
    </div>
  );
}
