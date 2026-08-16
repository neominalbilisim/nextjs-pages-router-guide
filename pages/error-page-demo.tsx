import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function ErrorPageDemo({
  renderedAt,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>_error.tsx demo</title>
      </Head>
      <span className="badge">getServerSideProps throw</span>
      <h1>_error.tsx / SSR Hatası</h1>
      <p className="lede">
        Bu sayfa normalde sorunsuz render olur (server render zamanı:{" "}
        <code>{renderedAt}</code>). Aşağıdaki linke tıklarsan{" "}
        <code>?crash=1</code> ile aynı sayfaya <strong>tam sayfa</strong>{" "}
        (full navigation) gidilir; <code>getServerSideProps</code> bilerek{" "}
        <code>throw</code> eder ve Next.js <code>pages/_error.tsx</code>&apos;i
        (dev) ya da <code>pages/500.tsx</code>&apos;i (production build)
        render eder.
      </p>

      <div className="card">
        {/* Bilerek <a> kullanıyoruz: Link ile client-side navigation yerine
            tam sayfa isteği atıp gerçek SSR hata akışını tetikliyoruz. */}
        <a className="btn danger" href="/error-page-demo?crash=1">
          SSR&apos;da patlat (?crash=1)
        </a>
      </div>

      <div className="callout warn" style={{ marginTop: 16 }}>
        <code>next dev</code> çalıştırıyorsan muhtemelen önce hata
        overlay&apos;ini göreceksin; onu kapatınca{" "}
        <code>_error.tsx</code> render olur. Gerçek{" "}
        <code>pages/500.tsx</code>&apos;i görmek için{" "}
        <code>npm run build &amp;&amp; npm run start</code> ile production
        modda dene.
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  renderedAt: string;
}> = async (context) => {
  if (context.query.crash === "1") {
    // Kasıtlı SSR hatası -> _error.tsx / 500.tsx tetiklenir.
    throw new Error("Kasıtlı olarak getServerSideProps içinde patlatıldı.");
  }

  return {
    props: { renderedAt: new Date().toISOString() },
  };
};
