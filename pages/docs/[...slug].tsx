import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Catch-all route: pages/docs/[...slug].tsx
 *
 * Eşleşenler:
 *  /docs/a            -> slug = ["a"]
 *  /docs/a/b          -> slug = ["a", "b"]
 *  /docs/a/b/c        -> slug = ["a", "b", "c"]
 *
 * NOT eşleşen: /docs (segment yok) -> bunun için optional catch-all
 * ([[...slug]].tsx, bkz. pages/shop/[[...slug]].tsx) gerekir.
 *
 * Bu sayfa client-side render (getServerSideProps/getStaticProps yok),
 * bu yüzden segment'leri doğrudan useRouter().query'den okuyoruz.
 */
export default function DocsCatchAll() {
  const router = useRouter();
  const slug = router.query.slug;
  const segments = Array.isArray(slug) ? slug : slug ? [slug] : [];

  return (
    <div>
      <Head>
        <title>{`/docs/${segments.join("/")}`}</title>
      </Head>
      <span className="badge">Catch-all route</span>
      <h1>Docs: /{segments.join("/")}</h1>
      <p className="lede">
        Dosya: <code>pages/docs/[...slug].tsx</code>. Bu URL herhangi bir
        derinlikte eşleşir.
      </p>

      <div className="card">
        <div className="kv">
          <dt>router.query.slug</dt>
          <dd>{JSON.stringify(slug)}</dd>
          <dt>segments.length</dt>
          <dd>{segments.length}</dd>
        </div>
      </div>

      <h2>Başka derinlikleri dene</h2>
      <ul className="route-list">
        <li>
          <Link href="/docs/getting-started">/docs/getting-started</Link>
        </li>
        <li>
          <Link href="/docs/getting-started/install">
            /docs/getting-started/install
          </Link>
        </li>
        <li>
          <Link href="/docs/api/reference/v2/users">
            /docs/api/reference/v2/users
          </Link>
        </li>
      </ul>
    </div>
  );
}
