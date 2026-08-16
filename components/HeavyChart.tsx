import { useEffect, useState } from "react";

/**
 * "Ağır" bir component'i simüle ediyor (ör. büyük bir chart kütüphanesi).
 * pages/dynamic-imports.tsx içinde `next/dynamic` + `ssr:false` ile
 * lazy-load ediliyor; sadece kullanıcı butona tıkladığında bundle'a
 * dahil edilip indiriliyor (manual code splitting).
 */
export default function HeavyChart() {
  const [bars] = useState(() =>
    Array.from({ length: 12 }, () => Math.round(20 + Math.random() * 80))
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="card">
      <div className="badge">window.* kullanan client-only component</div>
      <p style={{ marginTop: 8 }}>
        Bu component <code>typeof window</code> kontrolüne ihtiyaç
        duyabilecek, sadece tarayıcıda anlamlı olan bir grafik kütüphanesini
        temsil ediyor. Mounted:{" "}
        <code>{mounted ? "true (client)" : "false"}</code>
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          height: 120,
          marginTop: 12,
        }}
      >
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: `${h}%`,
              background: "var(--accent)",
              borderRadius: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
