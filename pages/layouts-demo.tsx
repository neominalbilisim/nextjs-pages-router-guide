import Head from "next/head";
import type { ReactElement } from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import DashboardLayout from "@/components/DashboardLayout";
import type { NextPageWithLayout } from "@/types/page";

const LayoutsDemo: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Layout Patterns</title>
      </Head>
      <span className="badge">Pattern 3: Nested Layouts</span>
      <h1>Layout Pattern&apos;leri</h1>
      <p className="lede">
        Pages Router&apos;da layout için 3 ana pattern var. Bu sayfa{" "}
        <strong>Pattern 3&apos;ü</strong> canlı gösteriyor (MainLayout içinde
        DashboardLayout); diğer iki pattern aşağıda kod ile anlatılıyor.
      </p>

      <h2>Pattern 1 — _app.tsx ile Global Layout</h2>
      <p>
        Bu proje zaten bu pattern&apos;i kullanıyor: Navbar/Footer{" "}
        <code>pages/_app.tsx</code>&apos;te, her sayfada aynı şekilde
        görünüyor. Problem: her sayfa aynı layout&apos;u kullanmak zorunda
        kalır (dashboard&apos;un sidebar&apos;ı gibi özel layout&apos;lar
        zor).
      </p>

      <h2>Pattern 2 — Per-Page Layout (Recommended)</h2>
      <p>
        <Link href="/dashboard">/dashboard</Link> sayfası bu pattern&apos;i
        kullanıyor: <code>Dashboard.getLayout = (page) =&gt; …</code>. Her
        sayfa kendi layout&apos;unu seçer, layout page geçişlerinde unmount
        olmadığı için state (scroll pozisyonu, sidebar açık/kapalı) korunur.
      </p>
      <div className="card">
        <pre>
          <code>{`const DashboardPage: NextPageWithLayout = () => <h1>Dashboard</h1>;

DashboardPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

// _app.tsx
const getLayout = Component.getLayout ?? ((page) => page);
return getLayout(<Component {...pageProps} />);`}</code>
        </pre>
      </div>

      <h2>Pattern 3 — Nested Layouts (şu an gördüğün)</h2>
      <p>
        Birden fazla layout iç içe sarılabilir. Aşağıdaki kutu:{" "}
        <code>MainLayout</code> (dış, mavi kesik çizgi) →{" "}
        <code>DashboardLayout</code> (iç, sidebar) → bu sayfanın içeriği.
      </p>
    </div>
  );
};

LayoutsDemo.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </MainLayout>
  );
};

export default LayoutsDemo;
