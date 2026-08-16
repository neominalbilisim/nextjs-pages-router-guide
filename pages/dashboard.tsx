import { type ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { parseCookies, SESSION_COOKIE } from '@/lib/cookies';
import { verifySessionToken } from '@/lib/jwt';
import DashboardLayout from '@/components/DashboardLayout';
import type { NextPageWithLayout } from '@/types/page';

const Dashboard: NextPageWithLayout<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, data, renderedAt }) => {
	const router = useRouter();

	async function handleLogout() {
		await fetch('/api/logout', { method: 'POST' });
		router.push('/login');
	}

	return (
		<div>
			<Head>
				<title>Dashboard</title>
			</Head>
			<span className="badge">getServerSideProps (SSR)</span>
			<h1>Dashboard</h1>
			<p className="lede">
				Bu sayfa <strong>her request&apos;te</strong> server&apos;da render
				edilir. Çerez yoksa <code>/login</code>&apos;a yönlendirilirsin.
			</p>

			<dl className="kv card">
				<dt>User</dt>
				<dd>
					{user.name} ({user.email})
				</dd>
				<dt>Server render zamanı</dt>
				<dd>{renderedAt}</dd>
				<dt>Data (server&apos;dan)</dt>
				<dd>{JSON.stringify(data)}</dd>
			</dl>

			<button onClick={handleLogout} style={{ marginTop: 12 }}>
				Çıkış yap
			</button>

			<div className="card">
				<p style={{ margin: 0 }}>
					Bu standalone demo için dashboard, yalnızca yerel veriler ve sayfa içi
					akışla çalışır; remote shell/federated widget örnekleri kaldırıldı.
				</p>
			</div>
		</div>
	);
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
	return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const cookies = parseCookies(context);
	const token = cookies[SESSION_COOKIE];
	const session = token ? verifySessionToken(token) : null;

	if (!session) {
		return {
			redirect: {
				destination: '/login?redirect=/dashboard',
				permanent: false,
			},
		};
	}

	// Gerçek projede burada token'daki sub (user id) ile bir API'den ek veri çekilir.
	const user = { name: session.name, email: session.email };
	const data = { activeOrders: 3, revenueToday: 4820 };

	return {
		props: {
			user,
			data,
			renderedAt: new Date().toISOString(),
		},
	};
};

export default Dashboard;
