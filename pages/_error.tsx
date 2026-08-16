import type { NextPageContext } from 'next';
import Link from 'next/link';

interface ErrorProps {
	statusCode?: number;
}

/**
 * Bu, Next.js'in SAYFA hata sayfasıdır. Şu durumlarda devreye girer:
 * - Host (shell) sayfası SSR sırasında patlarsa
 * - getServerSideProps / getInitialProps throw ederse
 * - Next.js router'ın yakaladığı sayfa seviyesi hatalar
 *
 * Bu örnekte sayfa/SSR seviyesindeki hataları yakalar. Client-side
 * async import hataları farklı bir katmanda ele alınır.
 *
 * Canlı test için: /error-page-demo sayfasına git, "SSR'da patlat"
 * butonuna bas -> getServerSideProps throw eder -> bu sayfa render olur.
 */
function Error({ statusCode }: ErrorProps) {
	return (
		<div className="error-box">
			<h1 style={{ marginTop: 0 }}>
				{statusCode ? `Server Error: ${statusCode}` : 'Client Error'}
			</h1>
			<p style={{ color: 'inherit' }}>
				{statusCode === 404 ? 'Sayfa bulunamadı' : 'Bir hata oluştu'}
			</p>
			<p style={{ color: 'inherit', fontSize: 13 }}>
				Bu sayfa <code>pages/_error.tsx</code> tarafından render edildi
				(sayfa/SSR seviyesi hata).
			</p>
			<Link href="/">← Ana sayfaya dön</Link>
		</div>
	);
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;
