import Head from 'next/head';
import Link from 'next/link';

const ROUTES: { path: string; label: string; desc: string }[] = [
	{
		path: '/about',
		label: 'About (Static Route)',
		desc: "En basit case: pages/about.tsx -> /about, build time'da statik.",
	},
	{
		path: '/blog',
		label: 'Blog listesi',
		desc: "getStaticProps ile build time'da veri çeken liste sayfası (SSG).",
	},
	{
		path: '/blog/nextjs-guide',
		label: 'Blog detayı',
		desc: 'getStaticProps + getStaticPaths + ISR (revalidate: 60), dynamic route [slug].tsx.',
	},
	{
		path: '/dashboard',
		label: 'Dashboard (SSR + Auth)',
		desc: "getServerSideProps: her request'te çalışır, cookie kontrolü, redirect, per-page layout ve gömülü 'remote' widget.",
	},
	{
		path: '/layouts-demo',
		label: "Layout Pattern'leri",
		desc: 'Pattern 1 (_app global), Pattern 2 (per-page getLayout), Pattern 3 (nested layouts) yan yana.',
	},
	{
		path: '/dynamic-imports',
		label: 'next/dynamic',
		desc: 'Basic lazy load, loading state, ssr:false, named export ile dynamic import.',
	},
	{
		path: '/error-boundary-demo',
		label: 'Error Boundary',
		desc: "Client render hatasını Error Boundary'nin nasıl yakaladığını canlı tetikle.",
	},
	{
		path: '/error-page-demo',
		label: '_error.tsx / SSR hatası',
		desc: "getServerSideProps'ta throw -> _error.tsx (dev) / 500.tsx (prod) tetikle.",
	},
	{
		path: '/navigation',
		label: 'Link & useRouter',
		desc: 'Link varyantları (query, prefetch=false), router.push/replace/back, route events.',
	},
	{
		path: '/performance',
		label: 'Performance & Optimization',
		desc: 'next/image, next/script stratejileri, middleware ile route koruması (bkz. /dashboard).',
	},
	{
		path: '/seo-demo',
		label: 'SEO (next/head)',
		desc: 'Title, description, Open Graph, Twitter Card, canonical.',
	},
	{
		path: '/docs/getting-started/install',
		label: 'Catch-all route',
		desc: 'pages/docs/[...slug].tsx -> /docs/a/b/c gibi herhangi bir derinlik.',
	},
	{
		path: '/shop',
		label: 'Optional catch-all route',
		desc: 'pages/shop/[[...slug]].tsx -> hem /shop hem /shop/kategori/urun eşleşir.',
	},
	{
		path: '/users',
		label: 'Users (gerçek API verisi)',
		desc: "Client'ta /api/users'a fetch atan liste sayfası; endpoint jsonplaceholder.typicode.com/users'tan gerçek veri çeker.",
	},
];

export default function Home() {
	return (
		<div>
			<Head>
				<title>Next.js Pages Router Playground</title>
			</Head>

			<span className="badge">Standalone demo</span>
			<h1>Next.js Pages Router Playground</h1>
			<p className="lede">
				01-NEXTJS-PAGES-ROUTER-GUIDE.md dökümanındaki her case&apos;in çalışan
				bir örneği bu projede. Aşağıdaki listeden istediğin case&apos;e gidip
				kodunu (dosya yolu route ile birebir eşleşiyor) okuyabilir, etkileşimli
				demoları deneyebilirsin.
			</p>

			<h2>Tüm case&apos;ler</h2>
			<ul className="route-list">
				{ROUTES.map((r) => (
					<li key={r.path}>
						<Link href={r.path} style={{ fontWeight: 600 }}>
							{r.label}
						</Link>
						<div className="path">{r.path}</div>
						<div className="desc">{r.desc}</div>
					</li>
				))}
			</ul>

			<h2>API Routes</h2>
			<ul className="route-list">
				<li>
					<span style={{ fontWeight: 600 }}>GET/POST /api/hello</span>
					<div className="desc">
						Basit API route örneği - method kontrolü ile.
					</div>
				</li>
				<li>
					<span style={{ fontWeight: 600 }}>GET /api/users/:id</span>
					<div className="desc">
						Dynamic API route (pages/api/users/[id].ts).
					</div>
				</li>
				<li>
					<span style={{ fontWeight: 600 }}>GET /api/users</span>
					<div className="desc">
						pages/api/users/index.ts — sunucu tarafında
						https://jsonplaceholder.typicode.com/users&apos;a fetch atıp
						gerçek API verisini döndürür. /users sayfası bu endpoint&apos;i
						client&apos;tan çağırıyor.
					</div>
				</li>
				<li>
					<span style={{ fontWeight: 600 }}>POST /api/login, /api/logout</span>
					<div className="desc">
						/dashboard sayfasındaki SSR auth demosu için cookie set/clear eder.
					</div>
				</li>
			</ul>
		</div>
	);
}
