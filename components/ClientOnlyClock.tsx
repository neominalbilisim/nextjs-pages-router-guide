import { useEffect, useState } from "react";

export default function ClientOnlyClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p style={{ color: "var(--text)", margin: 0 }}>
      🕐 Client saati: <code>{now.toLocaleTimeString("tr-TR")}</code> — bu
      component <code>ssr:false</code> olmasaydı server ve client farklı
      zaman render eder, hydration mismatch hatası verirdi.
    </p>
  );
}
