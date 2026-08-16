import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface SessionUser {
	name: string;
	email: string;
}

export default function Navbar() {
	const router = useRouter();
	const [user, setUser] = useState<SessionUser | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// /api/me httpOnly çerezi server tarafında okuyup çözümlüyor; Navbar
	// _app.tsx içinde yaşadığı ve sayfa geçişlerinde remount olmadığı için
	// oturum bilgisini her route değişiminde tazeliyoruz (login/logout sonrası
	// yönlendirme de bir route change'dir).
	useEffect(() => {
		let cancelled = false;

		async function loadUser() {
			const res = await fetch('/api/me');
			const body = await res.json();
			if (!cancelled) setUser(body.ok ? body.user : null);
		}

		loadUser();
		router.events.on('routeChangeComplete', loadUser);
		return () => {
			cancelled = true;
			router.events.off('routeChangeComplete', loadUser);
		};
	}, [router.events]);

	useEffect(() => {
		if (!menuOpen) return;

		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [menuOpen]);

	async function handleLogout() {
		await fetch('/api/logout', { method: 'POST' });
		setUser(null);
		setMenuOpen(false);
		router.push('/');
	}

	return (
		<header className="sticky top-0 z-20 border-b border-border bg-bg-elevated/80 backdrop-blur-md">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-3.5">
				<Link
					href="/"
					className="whitespace-nowrap bg-linear-to-r from-accent to-accent-strong bg-clip-text text-[15px] font-bold tracking-tight text-transparent no-underline transition-opacity hover:opacity-80"
				>
					📘 Pages Router Playground
				</Link>

				{user ? (
					<div ref={menuRef} className="relative">
						<button
							type="button"
							onClick={() => setMenuOpen((open) => !open)}
							className="flex items-center gap-2 rounded-full border border-border bg-bg-card py-1.5 pl-1.5 pr-3 text-[13px] font-medium text-text transition-colors hover:border-accent/40"
						>
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
								{user.name.slice(0, 1).toUpperCase()}
							</span>
							{user.name}
							<span className="text-text-dim">▾</span>
						</button>

						{menuOpen && (
							<div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-lg border border-border bg-bg-card p-1.5 shadow-lg shadow-black/30">
								<div className="px-2.5 py-2 text-[13px]">
									<div className="font-semibold text-text">{user.name}</div>
									<div className="truncate text-text-dim">{user.email}</div>
								</div>
								<div className="my-1 h-px bg-border" />
								<button
									type="button"
									onClick={handleLogout}
									className="w-full rounded-md px-2.5 py-2 text-left text-[13px] text-danger transition-colors hover:bg-danger-bg"
								>
									Çıkış yap
								</button>
							</div>
						)}
					</div>
				) : (
					<Link
						href="/login"
						className="rounded-md border border-border px-3 py-1.5 text-[13px] font-medium text-text-dim no-underline transition-colors hover:border-accent/40 hover:text-text"
					>
						Giriş yap
					</Link>
				)}
			</div>
		</header>
	);
}
