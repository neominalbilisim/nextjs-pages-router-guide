import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <strong style={{ fontSize: 12, color: "var(--text-dim)" }}>
          DASHBOARD
        </strong>
        <Link href="/dashboard">Genel Bakış</Link>
        <Link href="/dashboard?tab=widgets">Widget&apos;lar</Link>
        <Link href="/dashboard?tab=settings">Ayarlar</Link>
      </aside>
      <main>{children}</main>
    </div>
  );
}
