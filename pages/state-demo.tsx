/* eslint-disable react-hooks/refs */
import Head from "next/head";
import { useEffect, useRef } from "react";
import type { NextPage } from "next";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { useCartStore } from "@/store/useCartStore";

const PRODUCTS = [
  { id: "apple", name: "🍎 Elma" },
  { id: "banana", name: "🍌 Muz" },
];

// Sayacı render gövdesinde artırmak "impure render" sayılır: StrictMode
// dev modda HER render'ı (sadece mount'ta değil, her state güncellemesinde
// de) client'ta iki kez çalıştırdığı için bu, hem server/client metin
// uyuşmazlığına (hydration mismatch) hem de sayının gereğinden hızlı
// artmasına yol açar. Artırma işlemini useEffect'e taşımak bunu çözer:
// effect'ler (mount'taki tek seferlik setup→cleanup→setup simülasyonu
// hariç) StrictMode'da tekrar çalıştırılmaz. İlk render (server ve
// hydration) her zaman ref'in başlangıç değerini (0) okur; asıl artış
// sadece commit sonrası, effect içinde gerçekleşir.
function useRenderCount() {
  const ref = useRef(0);

  useEffect(() => {
    ref.current += 1;
  });

  return ref.current;
}

// --- Context API tarafı -----------------------------------------------

function ContextItemsPanel() {
  const { items, addItem, removeItem, clear } = useCart();
  const renderCount = useRenderCount();

  return (
    <div className="card">
      <span className="badge info">render sayısı: {renderCount}</span>
      <p style={{ marginTop: 8 }}>
        <strong>Sepet</strong> (items&apos;a bağlı)
      </p>
      {items.length === 0 && (
        <p className="lede" style={{ fontSize: 13 }}>
          Sepet boş.
        </p>
      )}
      <ul style={{ margin: "8px 0", paddingLeft: 18 }}>
        {items.map((i) => (
          <li key={i.id}>
            {i.name} × {i.qty}{" "}
            <button className="btn" onClick={() => removeItem(i.id)}>
              çıkar
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            className="btn"
            onClick={() => addItem({ id: p.id, name: p.name })}
          >
            {p.name} ekle
          </button>
        ))}
        <button className="btn" onClick={clear}>
          Temizle
        </button>
      </div>
    </div>
  );
}

function ContextNoteInput() {
  const { note, setNote } = useCart();

  return (
    <div className="card form" style={{ marginTop: 16 }}>
      <div className="field">
        <label htmlFor="context-note">İlgisiz alan (not) — items&apos;ı etkilemez</label>
        <input
          id="context-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Buraya yaz ve soldaki render sayısını izle..."
        />
      </div>
    </div>
  );
}

function ContextDemo() {
  return (
    <CartProvider>
      <ContextItemsPanel />
      <ContextNoteInput />
    </CartProvider>
  );
}

// --- Zustand tarafı ------------------------------------------------------

function ZustandItemsPanel() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const renderCount = useRenderCount();

  return (
    <div className="card">
      <span className="badge">render sayısı: {renderCount}</span>
      <p style={{ marginTop: 8 }}>
        <strong>Sepet</strong> (sadece items selector&apos;ı)
      </p>
      {items.length === 0 && (
        <p className="lede" style={{ fontSize: 13 }}>
          Sepet boş.
        </p>
      )}
      <ul style={{ margin: "8px 0", paddingLeft: 18 }}>
        {items.map((i) => (
          <li key={i.id}>
            {i.name} × {i.qty}{" "}
            <button className="btn" onClick={() => removeItem(i.id)}>
              çıkar
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            className="btn"
            onClick={() => addItem({ id: p.id, name: p.name })}
          >
            {p.name} ekle
          </button>
        ))}
        <button className="btn" onClick={clear}>
          Temizle
        </button>
      </div>
    </div>
  );
}

function ZustandNoteInput() {
  const note = useCartStore((s) => s.note);
  const setNote = useCartStore((s) => s.setNote);

  return (
    <div className="card form" style={{ marginTop: 16 }}>
      <div className="field">
        <label htmlFor="zustand-note">İlgisiz alan (not) — items&apos;ı etkilemez</label>
        <input
          id="zustand-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Buraya yaz ve soldaki render sayısının SABİT kaldığını izle..."
        />
      </div>
    </div>
  );
}

function ZustandDemo() {
  return (
    <>
      <ZustandItemsPanel />
      <ZustandNoteInput />
    </>
  );
}

// --- Sayfa ----------------------------------------------------------------

const StateDemo: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Zustand vs Context API — Canlı Karşılaştırma</title>
      </Head>
      <span className="badge">store/useCartStore.ts + contexts/CartContext.tsx</span>
      <h1>Zustand vs Context API</h1>
      <p className="lede">
        İkisi de aynı sepet state&apos;ini yönetiyor. &quot;İlgisiz alan&quot;
        kutusuna yazarken sol taraftaki (Context) render sayısının arttığını,
        sağ taraftaki (Zustand) render sayısının{" "}
        <strong>aynı kaldığını</strong> göreceksin — çünkü Zustand
        selector&apos;ı sadece <code>items</code> değiştiğinde tetiklenir,
        Context ise <code>value</code> objesi her render&apos;da yeniden
        oluştuğu için tüm tüketicileri re-render eder. Detaylı anlatım:{" "}
        <code>ZUSTAND-VS-CONTEXT-API.md</code>.
      </p>

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div>
          <h3>Context API</h3>
          <ContextDemo />
        </div>
        <div>
          <h3>Zustand</h3>
          <ZustandDemo />
        </div>
      </div>

      <div className="callout info" style={{ marginTop: 16 }}>
        <strong>Not alanına birkaç harf yaz:</strong> Context tarafındaki
        render sayısı her tuş vuruşunda artar; Zustand tarafındaki sabit
        kalır. Sepete ürün eklediğinde ise ikisi de artar — çünkü o an
        gerçekten ihtiyaç duydukları veri (<code>items</code>) değişiyor.
      </div>

      <div className="callout warn" style={{ marginTop: 16 }}>
        <strong>Sayfa navigasyonu:</strong> Zustand store&apos;u modül
        seviyesinde bir singleton, bu sayfadan ayrılıp geri geldiğinde sepet
        korunur. Context&apos;teki <code>CartProvider</code> ise bu sayfaya
        özel olduğu için sayfadan ayrılınca unmount olur ve state sıfırlanır.
      </div>

      <div className="callout" style={{ marginTop: 16 }}>
        <strong>Neden render sayısı 0&apos;dan başlıyor?</strong>{" "}
        <code>useRenderCount</code>, sayacı bir ref üzerinde{" "}
        <code>useEffect</code> içinde artırıyor (render gövdesinde değil).
        Bu yüzden sayfa ilk açıldığında (henüz hiçbir etkileşim olmadan) hem
        server hem client aynı değeri, <strong>0</strong>&apos;ı gösteriyor
        — hydration mismatch olmuyor. İlk etkileşimde (ilk tuş vuruşu/ürün
        ekleme) dev modda React StrictMode&apos;un mount effect&apos;ini bir
        kez fazladan (setup → cleanup → setup) çalıştırması yüzünden sayı{" "}
        <strong>+2</strong> artabilir; sonrasında her etkileşim tam{" "}
        <strong>+1</strong> arttırır. Production build&apos;de bu fazlalık
        olmaz, ilk etkileşim de tam +1 gösterir.
      </div>
    </div>
  );
};

export default StateDemo;
