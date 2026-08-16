import { useState } from 'react';
import Head from 'next/head';
import ErrorBoundary from '@/components/ErrorBoundary';
import BuggyComponent from '@/components/BuggyComponent';

export default function ErrorBoundaryDemo() {
	const [crash, setCrash] = useState(false);
	const [boundaryKey, setBoundaryKey] = useState(0);

	return (
		<div>
			<Head>
				<title>Error Boundary</title>
			</Head>
			<span className="badge">Client render hatası</span>
			<h1>Error Boundary</h1>
			<p className="lede">
				React&apos;in kendi özelliği (16+). Class component olmalı,{' '}
				<code>getDerivedStateFromError</code> ve <code>componentDidCatch</code>{' '}
				method&apos;ları gerekir; functional component&apos;te bu API yok.
				Sadece <strong>render sırasında throw</strong> edilen hataları yakalar —
				Promise reject&apos;leri (async import fail) ise ayrı bir yükleme
				senaryosu olarak ele alınır.
			</p>

			<div className="card">
				<button
					className="danger"
					onClick={() => setCrash(true)}
					disabled={crash}
				>
					{crash ? 'Patladı ✅' : "Component'i patlat"}
				</button>{' '}
				<button
					onClick={() => {
						setCrash(false);
						setBoundaryKey((k) => k + 1);
					}}
				>
					Sıfırla
				</button>
				<div style={{ marginTop: 14 }}>
					<ErrorBoundary key={boundaryKey}>
						<BuggyComponent crash={crash} />
					</ErrorBoundary>
				</div>
			</div>

			<div className="callout" style={{ marginTop: 20 }}>
				Bu sayfanın kendisi <code>pages/_app.tsx</code>&apos;teki global Error
				Boundary&apos;nin İÇİNDE, ayrıca kendi lokal boundary&apos;si ile de
				sarılı. React en yakın boundary&apos;yi kullanır — bu yüzden hata
				burada, sayfanın geri kalanını (Navbar, Footer) etkilemeden yakalanıyor.
			</div>
		</div>
	);
}
