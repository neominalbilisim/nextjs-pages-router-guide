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

const API_ROUTES: { method: string; path: string; desc: string }[] = [
	{
		method: 'GET/POST',
		path: '/api/hello',
		desc: 'Basit API route örneği - method kontrolü ile.',
	},
	{
		method: 'GET',
		path: '/api/users/:id',
		desc: 'Dynamic API route (pages/api/users/[id].ts).',
	},
	{
		method: 'GET',
		path: '/api/users',
		desc: "pages/api/users/index.ts — sunucu tarafında https://jsonplaceholder.typicode.com/users'a fetch atıp gerçek API verisini döndürür. /users sayfası bu endpoint'i client'tan çağırıyor.",
	},
	{
		method: 'POST',
		path: '/api/login, /api/logout',
		desc: '/dashboard sayfasındaki SSR auth demosu için cookie set/clear eder.',
	},
];

export default function Home() {
	return (
		<div>
			<Head>
				<title>Next.js Pages Router Playground</title>
			</Head>

			<p className="mb-6 text-sm leading-relaxed text-text-dim">
				Bu uygulama Neominal Akademi tarafından canlı oturumlar için
				geliştirilmiş, sektör standartlarına göre hazırlanan uçtan uca bir
				mühendislik uygulamasıdır.
			</p>

			<section className="border-b border-border pb-10">
				<span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
					<span className="h-1.5 w-1.5 rounded-full bg-accent" />
					Standalone demo
				</span>
				<h1 className="mt-4 bg-linear-to-r from-text to-text-dim bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
					Next.js Pages Router Playground
				</h1>
				<p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-dim">
					01-NEXTJS-PAGES-ROUTER-GUIDE.md dökümanındaki her case&apos;in çalışan
					bir örneği bu projede. Aşağıdaki listeden istediğin case&apos;e gidip
					kodunu (dosya yolu route ile birebir eşleşiyor) okuyabilir, etkileşimli
					demoları deneyebilirsin.
				</p>
			</section>

			<section className="mt-10">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
					Tüm case&apos;ler
				</h2>
				<ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{ROUTES.map((r) => (
						<li key={r.path}>
							<Link
								href={r.path}
								className="group block h-full rounded-xl border border-border bg-bg-card p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/20"
							>
								<div className="flex items-start justify-between gap-3">
									<span className="font-semibold text-text group-hover:text-accent">
										{r.label}
									</span>
									<span className="mt-0.5 text-text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
										→
									</span>
								</div>
								<div className="mt-1.5 font-mono text-[11px] text-accent">
									{r.path}
								</div>
								<div className="mt-1.5 text-[13px] text-text-dim">{r.desc}</div>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section className="mt-12">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
					API Routes
				</h2>
				<ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{API_ROUTES.map((r) => (
						<li
							key={r.path}
							className="rounded-xl border border-border bg-bg-card p-4"
						>
							<div className="flex flex-wrap items-center gap-2">
								<span className="rounded-md bg-info-bg px-1.5 py-0.5 font-mono text-[11px] font-semibold text-info">
									{r.method}
								</span>
								<span className="font-mono text-[13px] font-semibold text-text">
									{r.path}
								</span>
							</div>
							<div className="mt-1.5 text-[13px] text-text-dim">{r.desc}</div>
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
