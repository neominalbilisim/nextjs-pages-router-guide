import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { NextPageWithLayout } from '@/types/page';

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const router = useRouter();

	// Döküman örneğindeki "her sayfa yüklendiğinde çalışır" efekti
	useEffect(() => {
		console.log('Page changed!', router.pathname);
	}, [router.pathname]);

	// route event örneği (Navigation bölümü ile aynı fikir, global seviyede)
	useEffect(() => {
		const handleRouteChange = (url: string) => {
			console.log('[routeChangeStart] ->', url);
		};
		router.events.on('routeChangeStart', handleRouteChange);
		return () => router.events.off('routeChangeStart', handleRouteChange);
	}, [router.events]);

	// Pattern 2: sayfa kendi layout'unu tanımladıysa onu kullan, yoksa no-op
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<div className="layout-shell">
			<Navbar />
			{/*
        Global Error Boundary: _app.tsx seviyesinde tek bir boundary
        koymak, uygulama genelinde hata yakalamayı kolaylaştırır. Bu demo
        standalone olduğu için sayfa bazlı hata yönetişimi daha basit ve
        öngörülebilir şekilde tutulur.
      */}
			<main className="site-main">
				<ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
			</main>
			<Footer />
		</div>
	);
}
