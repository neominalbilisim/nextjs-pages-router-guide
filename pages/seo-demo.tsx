import Head from "next/head";

export default function SeoDemo() {
  return (
    <>
      <Head>
        <title>SEO Demo — Pages Router Playground</title>
        <meta
          name="description"
          content="Next.js Pages Router'da next/head ile SEO meta tag'lerini nasıl yönetirsin?"
        />
        <meta property="og:title" content="SEO Demo — Pages Router Playground" />
        <meta
          property="og:description"
          content="next/head ile title, description, Open Graph ve Twitter Card örneği."
        />
        <meta property="og:image" content="/hero.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://example.com/seo-demo" />
      </Head>

      <span className="badge">next/head</span>
      <h1>SEO</h1>
      <p className="lede">
        Bu sayfanın kaynağını görüntüle (View Page Source) — yukarıdaki
        meta tag&apos;lerin tarayıcı sekmesindeki başlığı değiştirdiğini ve
        HTML <code>&lt;head&gt;</code>&apos;inde göründüğünü doğrulayabilirsin.
        SPA-benzeri client navigation&apos;larda bile Next.js bu tag&apos;leri
        her sayfa geçişinde günceller.
      </p>

      <div className="card">
        <pre>
          <code>{`<Head>
  <title>SEO Demo — Pages Router Playground</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="/hero.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://example.com/seo-demo" />
</Head>`}</code>
        </pre>
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <code>next/head</code>&apos;e eklenen tag&apos;ler sayfa değiştikçe
        birikmez — Next.js aynı <code>key</code>&apos;e (ör. <code>name</code>{" "}
        veya <code>property</code>) sahip etiketleri otomatik olarak
        değiştirir, bu yüzden her sayfada kendi <code>&lt;title&gt;</code>
        &apos;ini tanımlamak güvenlidir.
      </div>
    </>
  );
}
