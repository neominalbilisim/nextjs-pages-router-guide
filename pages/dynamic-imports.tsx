import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Basic usage
const DynamicHello = dynamic(() => import('@/components/InlineHello'));

// With loading state
const DynamicHelloWithLoading = dynamic(
	() => import('@/components/InlineHello'),
	{ loading: () => <p className="loading-box">Loading...</p> },
);

// Disable SSR (for browser-only components)
const NoSSRClock = dynamic(() => import('@/components/ClientOnlyClock'), {
	ssr: false,
});

// Named export
const DynamicNamedExport = dynamic(() =>
	import('@/components/InlineHello').then((mod) => mod.HeavyNamedExport),
);

// Manual code splitting: sadece kullanıcı isteyince indirilir
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
	ssr: false,
});

export default function DynamicImportsDemo() {
	const [showChart, setShowChart] = useState(false);

	return (
		<div>
			<Head>
				<title>next/dynamic</title>
			</Head>
			<span className="badge">next/dynamic</span>
			<h1>Dynamic Imports</h1>
			<p className="lede">
				Component&apos;leri lazy load etmenin 5 varyantı — bundle&apos;ı
				küçültmek ve SSR&apos;ı seçmeli devre dışı bırakmak için.
			</p>

			<h2>1. Basic usage</h2>
			<div className="card">
				<DynamicHello />
			</div>

			<h2>2. Loading state ile</h2>
			<div className="card">
				<DynamicHelloWithLoading />
			</div>

			<h2>3. ssr: false (browser-only)</h2>
			<p>
				Bu component <code>Date.now()</code>&apos;u sadece client&apos;ta render
				eder — SSR&apos;da çalışsaydı hydration mismatch olurdu.
			</p>
			<div className="card">
				<NoSSRClock />
			</div>

			<h2>4. Named export ile</h2>
			<div className="card">
				<DynamicNamedExport />
			</div>

			<h2>5. Manuel code splitting</h2>
			<p>
				<code>HeavyChart</code> bundle&apos;a ancak butona basıldığında dahil
				olur — network sekmesinde yeni bir <code>.js</code> chunk&apos;ı
				indiğini görebilirsin.
			</p>
			<button
				className="primary"
				onClick={() => setShowChart(true)}
				disabled={showChart}
			>
				{showChart ? 'Chart yüklendi' : 'Show Chart'}
			</button>
			{showChart && (
				<div style={{ marginTop: 12 }}>
					<HeavyChart />
				</div>
			)}
		</div>
	);
}
