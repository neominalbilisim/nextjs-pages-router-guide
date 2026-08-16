import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS: { href: string; label: string }[] = [
	{ href: '/', label: 'Ana Sayfa' },
	{ href: '/about', label: 'About' },
	{ href: '/blog', label: 'Blog (SSG)' },
	{ href: '/dashboard', label: 'Dashboard (SSR)' },
	{ href: '/users', label: 'Users (gerçek API)' },
	{ href: '/layouts-demo', label: 'Layouts' },
	{ href: '/dynamic-imports', label: 'Dynamic Import' },
	{ href: '/error-boundary-demo', label: 'Error Boundary' },
	{ href: '/error-page-demo', label: '_error.tsx' },
	{ href: '/navigation', label: 'Navigation' },
	{ href: '/performance', label: 'Performance' },
	{ href: '/seo-demo', label: 'SEO' },
	{ href: '/docs/getting-started/install', label: 'Catch-all' },
	{ href: '/shop', label: 'Optional Catch-all' },
];

export default function Navbar() {
	const router = useRouter();

	return (
		<header className="site-header">
			<div className="site-header-inner">
				<Link href="/" className="brand">
					📘 Pages Router Playground
				</Link>
				<nav className="nav-links">
					{LINKS.map((link) => {
						const isActive =
							link.href === '/'
								? router.pathname === '/'
								: router.asPath.startsWith(
										link.href.split('?')[0].split('/').slice(0, 2).join('/'),
									);
						return (
							<Link
								key={link.href}
								href={link.href}
								className={isActive ? 'active' : undefined}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
