import Head from "next/head";
import type { NextPage } from "next";
import useLocalStorage from "@/hooks/useLocalStorage";

const HooksDemo: NextPage = () => {
  const [count, setCount] = useLocalStorage("hooks-demo-count", 0);
  const [note, setNote] = useLocalStorage("hooks-demo-note", "");

  return (
    <div>
      <Head>
        <title>Custom Hook Demo — useLocalStorage</title>
      </Head>
      <span className="badge">hooks/useLocalStorage.ts</span>
      <h1>Custom Hook: useLocalStorage</h1>
      <p className="lede">
        <code>useState</code>&apos;in localStorage ile senkron çalışan hali.
        Sayfayı yenile (F5) — sayaç ve not değeri kaybolmaz çünkü değerler
        tarayıcının <code>localStorage</code>&apos;ına yazılıyor.
      </p>

      <div className="card">
        <p>
          Sayaç: <strong>{count}</strong>
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => setCount((c) => c - 1)}>
            -1
          </button>
          <button className="btn" onClick={() => setCount((c) => c + 1)}>
            +1
          </button>
          <button className="btn" onClick={() => setCount(0)}>
            Sıfırla
          </button>
        </div>
      </div>

      <div className="card form" style={{ marginTop: 16 }}>
        <div className="field">
          <label htmlFor="note">Not (localStorage&apos;a yazılır)</label>
          <input
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bir şeyler yaz ve sayfayı yenile..."
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <pre>
          <code>{`const [count, setCount] = useLocalStorage("hooks-demo-count", 0);

<button onClick={() => setCount((c) => c + 1)}>+1</button>`}</code>
        </pre>
      </div>

      <div className="callout info" style={{ marginTop: 16 }}>
        İlk render&apos;da (server&apos;da ve client&apos;ın mount öncesi
        anında) değer her zaman <code>initialValue</code>&apos;dur;
        localStorage&apos;daki gerçek değer <code>useEffect</code> içinde,
        yalnızca client&apos;ta okunur. Bu yüzden hydration mismatch olmaz.
      </div>
    </div>
  );
};

export default HooksDemo;
