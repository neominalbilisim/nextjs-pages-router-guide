import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { useState } from "react";
import Link from "next/link";

export default function PerformanceDemo() {
  const [log, setLog] = useState<string[]>([]);
  const pushLog = (msg: string) =>
    setLog((prev) => [msg, ...prev].slice(0, 8));

  return (
    <div>
      <Head>
        <title>Performance &amp; Optimization</title>
      </Head>
      <span className="badge">next/image · next/script · middleware · ISR</span>
      <h1>Performance &amp; Optimization</h1>
      <p className="lede">
        Dökümandaki performans bölümünün 5 alt başlığı: Image, Font, Script,
        Code Splitting, Middleware, ISR.
      </p>

      <h2>1. Image Optimization</h2>
      <p>
        Local bir SVG&apos;yi <code>next/image</code> ile render ediyoruz.
        Genişlik/yükseklik otomatik olarak import edilen dosyadan alınır.
      </p>
      <div className="card">
        <Image
          src="/hero.svg"
          alt="Hero"
          width={800}
          height={400}
          priority
          style={{ width: "100%", height: "auto", borderRadius: 8 }}
        />
      </div>
      <div className="callout" style={{ marginTop: 12 }}>
        Dış (remote) görseller için <code>next.config.ts</code>&apos;e{" "}
        <code>images.remotePatterns</code> eklemek gerekir (eski{" "}
        <code>images.domains</code> alanı deprecated) — aşağıda referans
        olarak duruyor:
      </div>
      <pre>
        <code>{`// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'example.com' },
    { protocol: 'https', hostname: 'cdn.example.com' },
  ],
  formats: ['image/avif', 'image/webp'],
}`}</code>
      </pre>

      <h2>2. Font Optimization</h2>
      <p>
        Pages Router (13 öncesi) için <code>@next/font</code> yerine{" "}
        <code>pages/_document.tsx</code> içine <code>&lt;link&gt;</code> ile
        Google Fonts ekleniyor — bu projede zaten <code>_document.tsx</code>
        &apos;te Inter fontu bu şekilde yükleniyor, kaynağına oradan
        bakabilirsin.
      </p>

      <h2>3. Script Optimization</h2>
      <p>
        Üç farklı <code>strategy</code> — network sekmesinde ne zaman
        indiklerini gözlemleyebilirsin.
      </p>
      <div className="card">
        <Script
          id="after-interactive-demo"
          strategy="afterInteractive"
          onLoad={() => pushLog("afterInteractive script çalıştı")}
        >
          {`console.log('[afterInteractive] analytics.js gibi davranıyor')`}
        </Script>
        <Script
          id="lazy-onload-demo"
          strategy="lazyOnload"
          onLoad={() => pushLog("lazyOnload script çalıştı")}
        >
          {`console.log('[lazyOnload] chat widget gibi davranıyor')`}
        </Script>
        <p style={{ margin: 0 }}>
          Konsolu aç; sayfa yüklendiğinde iki inline script de sırayla
          çalışacak.
        </p>
        <pre style={{ marginTop: 10 }}>
          <code>{log.length ? log.join("\n") : "Script log'ları burada görünecek..."}</code>
        </pre>
      </div>
      <table>
        <thead>
          <tr>
            <th>strategy</th>
            <th>Ne zaman?</th>
            <th>Örnek kullanım</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>beforeInteractive</td>
            <td>Sayfa interaktif olmadan önce</td>
            <td>Polyfill&apos;ler</td>
          </tr>
          <tr>
            <td>afterInteractive (default)</td>
            <td>Sayfa interaktif olduktan hemen sonra</td>
            <td>Analytics (GA)</td>
          </tr>
          <tr>
            <td>lazyOnload</td>
            <td>Browser boşta kalınca</td>
            <td>Chat widget&apos;ları</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Code Splitting</h2>
      <p>
        Otomatik: her sayfa kendi bundle&apos;ına ayrılır (
        <code>pages/about.tsx</code> → <code>about.js</code>). Manuel
        code-splitting örneğini{" "}
        <Link href="/dynamic-imports">/dynamic-imports</Link> sayfasındaki
        &quot;Show Chart&quot; butonunda görebilirsin.
      </p>

      <h2>5. Middleware (Edge Functions)</h2>
      <p>
        Bu projenin kök dizininde <code>middleware.ts</code> var ve{" "}
        <code>/dashboard/:path*</code>&apos;i koruyor — çerezsiz{" "}
        <Link href="/dashboard">/dashboard</Link>&apos;a gitmeyi dene, edge
        seviyesinde <code>/login</code>&apos;a yönlendirileceksin (bu,
        sayfanın kendi <code>getServerSideProps</code> kontrolünden{" "}
        <em>önce</em> devreye girer).
      </p>

      <h2>6. ISR (Incremental Static Regeneration)</h2>
      <p>
        <Link href="/blog">/blog</Link> ve{" "}
        <Link href="/blog/nextjs-guide">/blog/nextjs-guide</Link>{" "}
        sayfalarında <code>revalidate: 60</code> ile canlı örneğini
        görebilirsin: build time&apos;da statik HTML üretilir, 60 saniye
        cache&apos;ten servis edilir, sonra arka planda yeniden üretilir.
      </p>
    </div>
  );
}
