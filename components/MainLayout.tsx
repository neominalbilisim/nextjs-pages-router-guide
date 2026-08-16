import { ReactNode } from "react";

/**
 * Pattern 3 (Nested Layouts) için "dış" layout.
 * Not: Bu demoda site genelindeki Navbar/Footer zaten pages/_app.tsx'te var,
 * bu yüzden MainLayout burada ekstra bir "marketing chrome" bandı olarak
 * gösteriliyor — dökümandaki Navbar/Footer sarmalama fikrini birebir
 * temsil ediyor.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px dashed var(--info)",
        borderRadius: "var(--radius)",
        padding: 16,
      }}
    >
      <div className="badge info" style={{ marginBottom: 12 }}>
        MainLayout (dış katman)
      </div>
      {children}
    </div>
  );
}
