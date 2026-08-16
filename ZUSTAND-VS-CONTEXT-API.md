# ⚖️ Global State: Zustand vs Context API

Bu döküman, aynı problemi (sepet/cart state'i — birden fazla component'in
okuyup güncellediği global bir state) hem **Context API** hem de
**Zustand** ile çözüp, ikisini karşılaştırır. Amaç "hangisi daha iyi"
sorusuna genel geçer bir cevap vermek değil, **Pages Router'da global
state ihtiyacı olduğunda hangi durumda hangisini seçmen gerektiğini**
göstermek.

> 📝 Aşağıdaki kod blokları anlatım amaçlıdır. **Çalışan hâli bu repoda
> gerçekten var:** `store/useCartStore.ts`, `contexts/CartContext.tsx`
> ve ikisini yan yana canlı gösteren `pages/state-demo.tsx` (route:
> `/state-demo`, Navbar'da "Zustand vs Context" linki). Orada, sepete
> ürün eklemenin yanında "ilgisiz alan"a yazınca Context tarafının
> re-render sayısının arttığını, Zustand tarafının aynı kaldığını canlı
> görebilirsin.

---

## 📑 İçindekiler

1. [Problem: Sepet (Cart) State'i](#problem-sepet-cart-statei)
2. [Çözüm 1: Context API](#çözüm-1-context-api)
3. [Çözüm 2: Zustand](#çözüm-2-zustand)
4. [Karşılaştırma Tablosu](#karşılaştırma-tablosu)
5. [Neden Zustand Tercih Ediyoruz?](#neden-zustand-tercih-ediyoruz)
6. [Context API Ne Zaman Hâlâ Doğru Seçim?](#context-api-ne-zaman-hâlâ-doğru-seçim)
7. [Pages Router'da SSR Notu](#pages-routerda-ssr-notu)
8. [Özet](#özet)

---

## Problem: Sepet (Cart) State'i

Senaryo: `Navbar`'da sepetteki ürün sayısını gösteren bir badge var,
`/shop` sayfasında ürün ekleyip çıkarma butonları var. İkisi de **aynı
state'i** paylaşmak zorunda — bu klasik bir "global state" ihtiyacı,
`useState` ile prop drilling yapmadan çözülemez.

```typescript
interface CartItem {
  id: string;
  name: string;
  qty: number;
}
```

---

## Çözüm 1: Context API

React'in kendi built-in çözümü. Üç parça gerekir: **Context**, bir
**Provider** (genelde `useReducer` ile) ve tüketen component'lerin
kullanacağı bir **custom hook**.

```typescript
// contexts/CartContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: "ADD", item }),
    removeItem: (id) => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Context'i doğrudan export etmek yerine bir hook'la sarmak,
// Provider dışında kullanılırsa erken ve anlaşılır bir hata verir.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
```

```typescript
// pages/_app.tsx — tüm sayfaları sarmalı ki her yerden erişilsin
import { CartProvider } from "@/contexts/CartContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}
```

```typescript
// components/Navbar.tsx (badge kısmı)
import { useCart } from "@/contexts/CartContext";

function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  return <span className="badge">{count}</span>;
}
```

```typescript
// pages/shop/index.tsx
import { useCart } from "@/contexts/CartContext";

function ShopPage() {
  const { items, addItem, removeItem } = useCart();
  // ...
}
```

**Dikkat noktası:** `CartBadge` yalnızca `items.length`'e ihtiyaç
duysa bile, context `value` her render'da yeni bir obje olduğu için
(`addItem`, `removeItem` her seferinde yeniden tanımlanıyor) **context'i
tüketen her component, state'in herhangi bir parçası değiştiğinde
re-render olur.** Bunu önlemek için `value`'yu `useMemo`'ya almak,
action'ları `useCallback`'e almak ya da context'i ikiye bölmek
(state context + dispatch context) gerekir — bu da ekstra boilerplate
demek.

---

## Çözüm 2: Zustand

Aynı sepet state'i, Zustand ile:

```typescript
// store/useCartStore.ts
import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));
```

Provider yok — `_app.tsx`'te hiçbir şey sarmalamana gerek yok. Hook'u
doğrudan ihtiyaç duyulan component'te import edip kullanıyorsun:

```typescript
// components/Navbar.tsx (badge kısmı)
import { useCartStore } from "@/store/useCartStore";

function CartBadge() {
  // Selector: sadece toplam adet değişince re-render olur,
  // items array'inin referansı değişse bile qty toplamı aynıysa olmaz.
  const count = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.qty, 0)
  );
  return <span className="badge">{count}</span>;
}
```

```typescript
// pages/shop/index.tsx
import { useCartStore } from "@/store/useCartStore";

function ShopPage() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  // ...
}
```

Component tree dışından bile erişilebilir (ör. bir `fetch`
interceptor'ında sepeti temizlemek için):

```typescript
useCartStore.getState().clear();
```

---

## Karşılaştırma Tablosu

| Kriter                             | Context API                                                     | Zustand                                                |
| ----------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| **Provider gerekiyor mu?**         | ✅ Evet, `_app.tsx`'i sarmalı                                    | ❌ Hayır, direkt import                                 |
| **Boilerplate**                    | Context + reducer + Provider + custom hook (4 parça)             | `create()` ile tek dosya                                |
| **Selective re-render**            | ❌ Yok (manuel `useMemo`/context split gerekir)                  | ✅ Selector ile built-in                                |
| **DevTools**                       | ❌ Yok (React DevTools ile sınırlı)                              | ✅ Redux DevTools middleware'i ile                      |
| **Persist (localStorage)**         | ❌ Elle yazman lazım                                             | ✅ `persist` middleware, tek satır                      |
| **Component dışından erişim**      | ❌ Sadece hook üzerinden, component tree içinde                  | ✅ `store.getState()` / `store.setState()` her yerden   |
| **Async action**                   | Elle (thunk pattern taklidi)                                    | Doğrudan `async` action yazılabilir                     |
| **Bundle size**                    | 0 (React'in parçası)                                             | ~1KB (minimal, ekstra dependency)                        |
| **Öğrenme eğrisi**                 | React bilen zaten biliyor                                        | Küçük API, dakikalar içinde öğrenilir                    |
| **En uygun olduğu durum**          | Nadiren değişen, düşük frekanslı state (tema, locale, auth user) | Sık güncellenen, çok component'in paylaştığı state       |

---

## Neden Zustand Tercih Ediyoruz?

1. **Re-render performansı** — Context'te `value` değiştiğinde, o
   context'i `useContext` ile tüketen **her** component re-render olur;
   state'in hangi parçasına ihtiyaç duyduğu önemli değil. Zustand'da
   selector kullanıldığı için bir component sadece gerçekten
   ihtiyaç duyduğu slice değiştiğinde re-render olur (yukarıdaki
   `CartBadge` örneğinde `qty` toplamı değişmediği sürece hiç
   render olmaz). Sepet, form state'i gibi sık güncellenen
   state'lerde bu fark performansta doğrudan hissedilir.

2. **Daha az boilerplate** — Context'te aynı işi yapmak için context
   objesi + reducer + Provider component + guard'lı custom hook
   yazman gerekiyor. Zustand'da `create()` çağrısı tek başına yeterli.
   Yeni bir store eklemek "bir dosya" seviyesinde bir işlem.

3. **Provider "pyramid" yok** — Birden fazla context'in olduğu bir
   projede `_app.tsx` art arda sarmalayan Provider'larla dolar
   (`<AuthProvider><ThemeProvider><CartProvider>...`). Zustand
   store'ları bağımsız hook'lar olduğu için hiçbir sarmalama
   gerektirmez, `_app.tsx` sade kalır.

4. **Built-in middleware'ler** — `persist` (localStorage/sessionStorage
   ile otomatik senkron — bkz. bu projedeki
   [`useLocalStorage`](hooks/useLocalStorage.ts) hook'unun elle yaptığını
   Zustand'da tek satırla alırsın), `devtools` (Redux DevTools
   entegrasyonu, action geçmişini görme) ve `immer` (mutable syntax'la
   immutable update) gibi hazır çözümler var. Context'te bunların
   hepsini elle yazman gerekir.

5. **React dışından erişim** — `store.getState()` ve `store.setState()`
   component tree'nin tamamen dışından (bir API client interceptor'ı,
   bir WebSocket event handler'ı, hatta bir test dosyası) çalışır.
   Context bir React primitive'i olduğu için sadece component ağacı
   içinde, `useContext` ile okunabilir.

**Özet gerekçe:** Context API "prop drilling'i önleyen bir dependency
injection mekanizması" olarak tasarlandı, bir state management
kütüphanesi değil. Sık güncellenen, çok component'in paylaştığı state
için üzerine performans optimizasyonu ve boilerplate inşa etmek
gerekiyor — Zustand bunu zaten built-in çözüyor.

---

## Context API Ne Zaman Hâlâ Doğru Seçim?

Zustand her zaman "daha iyi" değil. Context şu durumlarda yeterli, hatta
daha doğru:

- ✅ **Nadiren değişen state** — tema (`light`/`dark`), locale, giriş
  yapmış kullanıcı bilgisi gibi neredeyse hiç güncellenmeyen veriler.
  Re-render maliyeti pratikte önemsiz.
- ✅ **Dependency injection** — bir servis instance'ı, bir config
  objesi ya da bir test/mock implementasyonunu component ağacına
  geçirmek. Bu, state management değil, "bunu aşağı ilet" problemi.
- ✅ **Yeni bağımlılık eklememek istemek** — çok küçük, tek seferlik
  bir paylaşım ihtiyacı varsa ekstra paket eklemek gereksiz olabilir.
- ✅ **React'in kendi ekosistemine bağlı kalmak** — bazı takımlar
  bilinçli olarak üçüncü parti state kütüphanesi kullanmamayı tercih
  eder (bundle size, dependency yüzeyi, uzun vadeli bakım).

---

## Pages Router'da SSR Notu

Zustand store'u modül seviyesinde tek bir `create()` çağrısıyla
tanımlanır (yukarıdaki `useCartStore` örneğindeki gibi). Bu, **client-side
state** için sorun değildir (sepet, UI state, form taslağı vb.) — tarayıcı
başına tek bir store instance'ı yeterlidir.

Ama store'a `getServerSideProps` içinde ya da bir API route'ta,
**request'e özel** veri (ör. kullanıcıya özel bir değer) yazıyorsan
dikkat: Node.js process'i istekler arasında paylaşıldığı için modül
seviyesindeki tek store, farklı kullanıcıların isteklerini birbirine
karıştırabilir. Bu repodaki [`useLocalStorage`](hooks/useLocalStorage.ts)
hook'undaki mantıkla aynı kural geçerli: **browser-only state'i sadece
client'ta** oku/yaz, sunucu tarafında paylaşılan bir store'a
request-specific veri koyma.

---

## Özet

| Soru                                                        | Cevap    |
| ------------------------------------------------------------ | -------- |
| Sık güncellenen, çok component'in okuduğu global state mi?  | Zustand  |
| Nadiren değişen, "aşağı ilet" tipi bir değer mi?             | Context  |
| Persist/devtools/selector gibi hazır araçlara ihtiyaç var mı? | Zustand  |
| Yeni bağımlılık eklemek istemiyor musun?                     | Context  |
