import Head from "next/head";
import type { NextPage } from "next";

/**
 * En temel case: "Dosya = Route".
 * pages/about.tsx -> /about
 * Data fetching yok, bu yüzden Next.js bunu tamamen statik (SSG) olarak
 * build eder - herhangi bir getStaticProps/getServerSideProps olmadan.
 */
const About: NextPage = () => {
  return (
    <div>
      <Head>
        <title>About</title>
      </Head>
      <span className="badge">Static route</span>
      <h1>About</h1>
      <p className="lede">
        Bu sayfanın hiç data fetching method&apos;u yok. Next.js
        <code>pages/about.tsx</code> dosyasını otomatik olarak build
        time&apos;da statik HTML&apos;e çevirir - <code>getStaticProps</code>{" "}
        yazmaya bile gerek yok.
      </p>
      <div className="card">
        <pre>
          <code>{`pages/
  index.tsx        →  /
  about.tsx        →  /about   ← şu an buradasın
  blog/
    index.tsx      →  /blog
    [slug].tsx     →  /blog/:slug`}</code>
        </pre>
      </div>
    </div>
  );
};

export default About;
