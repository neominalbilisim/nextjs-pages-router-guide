import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NavigationDemo() {
  const router = useRouter();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const push = (msg: string) =>
      setLog((prev) => [msg, ...prev].slice(0, 6));

    const onStart = (url: string) => push(`routeChangeStart -> ${url}`);
    const onComplete = (url: string) => push(`routeChangeComplete -> ${url}`);

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
    };
  }, [router.events]);

  return (
    <div>
      <Head>
        <title>Navigation</title>
      </Head>
      <span className="badge">Link &amp; useRouter</span>
      <h1>Navigation</h1>

      <h2>Link varyantları</h2>
      <div className="card grid grid-2">
        <div>
          <Link href="/about">Basic link → /about</Link>
        </div>
        <div>
          <Link href={`/blog/${"nextjs-guide"}`}>
            Dynamic link → /blog/nextjs-guide
          </Link>
        </div>
        <div>
          <Link href={{ pathname: "/blog", query: { category: "tech" } }}>
            Query param ile → /blog?category=tech
          </Link>
        </div>
        <div>
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            External link (normal &lt;a&gt;)
          </a>
        </div>
        <div>
          <Link href="/dashboard" prefetch={false}>
            Prefetch disabled → /dashboard
          </Link>
        </div>
      </div>

      <h2>useRouter — route bilgisi</h2>
      <dl className="kv card">
        <dt>pathname</dt>
        <dd>{router.pathname}</dd>
        <dt>query</dt>
        <dd>{JSON.stringify(router.query)}</dd>
        <dt>asPath</dt>
        <dd>{router.asPath}</dd>
      </dl>

      <h2>useRouter — programatik navigation</h2>
      <div className="card">
        <button onClick={() => router.push("/about")}>router.push</button>{" "}
        <button
          onClick={() =>
            router.push({ pathname: "/blog", query: { id: "1" } })
          }
        >
          router.push (query ile)
        </button>{" "}
        <button onClick={() => router.replace("/navigation?visited=1")}>
          router.replace
        </button>{" "}
        <button onClick={() => router.back()}>router.back</button>{" "}
        <button onClick={() => router.reload()}>router.reload</button>
      </div>

      <h2>Route events (canlı log)</h2>
      <p className="lede">
        Bir linke tıkla, aşağıdaki log&apos;u izle (en yeni en üstte).
      </p>
      <pre>
        <code>{log.length ? log.join("\n") : "Henüz event yok — bir linke tıkla."}</code>
      </pre>
    </div>
  );
}
