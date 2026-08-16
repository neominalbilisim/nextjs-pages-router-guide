# 🎨 Tailwind CSS Entegrasyonu

Bu döküman, projeye eklenen **Tailwind CSS v4** entegrasyonunu anlatır:
neyin, neden, nasıl eklendiğini; mevcut `styles/globals.css` içindeki eski
custom class sistemiyle (`.card`, `.badge`, `.route-list` vb.) nasıl bir
arada yaşadığını ve yeni sayfalar/component'ler yazarken nelere dikkat
etmen gerektiğini.

> 📝 Bu proje **Next.js 16**'da varsayılan olarak **Turbopack** kullanıyor
> (`next dev` / `next build`). Aşağıdaki kurulum doğrudan Turbopack ile
> çalışır; ayrıca bir webpack yapılandırmasına gerek yoktur.

---

## 📑 İçindekiler

1. [Neden Tailwind v4?](#neden-tailwind-v4)
2. [Kurulum](#kurulum)
3. [Dosya Değişiklikleri](#dosya-değişiklikleri)
4. [Tasarım Tokenları: CSS Değişkenlerinden `@theme`'e](#tasarım-tokenları-css-değişkenlerinden-themee)
5. [⚠️ Cascade Layers Tuzağı](#️-cascade-layers-tuzağı)
6. [Eski Class Sistemi ile Birlikte Kullanım](#eski-class-sistemi-ile-birlikte-kullanım)
7. [Modernize Edilen Ekranlar](#modernize-edilen-ekranlar)
8. [Yeni Bir Sayfayı Tailwind'e Taşımak](#yeni-bir-sayfayı-tailwinde-taşımak)
9. [Özet](#özet)

---

## Neden Tailwind v4?

Next.js 16'da `create-next-app` varsayılan olarak Tailwind CSS'i kurar ve
güncel Tailwind sürümü **v4**'tür. v3'e göre en büyük fark: ayrı bir
`tailwind.config.js` dosyasına ve `content: [...]` glob listesine gerek
yok — tarama otomatik, tema tanımı da CSS içinde `@theme` at-rule'ü ile
yapılıyor. Bu da bizim gibi tek bir `globals.css`'i olan, App Router'a
geçmemiş bir Pages Router projesinde kurulumu oldukça sade tutuyor.

## Kurulum

Üç paket, devDependency olarak eklendi:

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

- **`tailwindcss`** — çekirdek motor.
- **`@tailwindcss/postcss`** — Tailwind'in PostCSS plugin'i (v4'te
  `tailwindcss` paketinin kendisi artık bir PostCSS plugin'i değil, bu
  yüzden ayrı paket gerekiyor).
- **`postcss`** — Next.js'in webpack fallback'i için zaten gerekli olan
  peer dependency.

## Dosya Değişiklikleri

### `postcss.config.mjs` (yeni dosya)

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Next.js hem Turbopack'te hem de olası bir `--webpack` build'inde bu
dosyayı proje kökünden otomatik okur (bkz. `postcssrc` çözümlemesi,
[node_modules/next/dist/docs/02-pages/02-guides/post-css.md](node_modules/next/dist/docs/02-pages/02-guides/post-css.md)).
Custom bir PostCSS config tanımlandığı için Next'in varsayılan
Autoprefixer/`postcss-preset-env` davranışı devre dışı kalır; Tailwind v4
zaten kendi vendor-prefixing'ini Lightning CSS/PostCSS pipeline'ı
üzerinden hallettiği için bu proje için ekstra bir plugin eklemeye
gerek duyulmadı.

### `styles/globals.css`

En üste tek satır eklendi:

```css
@import "tailwindcss";
```

Bu satır Tailwind'in `theme`, `base` (preflight), `components` ve
`utilities` katmanlarının hepsini bu noktaya enjekte eder.

## Tasarım Tokenları: CSS Değişkenlerinden `@theme`'e

Projede zaten bir `:root` içinde renk/font design token'ları vardı
(`--bg`, `--accent`, `--text-dim`, `--font-mono` ...). Bunları **iki kere
tanımlamamak** için, `@theme` bloğu bu değişkenlere referans veriyor:

```css
@theme {
  --color-accent: var(--accent);
  --color-bg-card: var(--bg-card);
  --font-mono: var(--font-mono);
  /* ... */
}
```

Bu sayede:

- Eski `.card`, `.badge` gibi class'lar hâlâ `var(--accent)` gibi ham
  değişkenleri kullanıyor.
- Yeni Tailwind utility'leri (`bg-accent`, `text-text-dim`,
  `border-border`, `font-mono` ...) **aynı renk paletini** kullanıyor —
  iki paralel renk sistemi oluşmuyor.

Yeni bir tasarım tokenı eklemek istersen (ör. yeni bir accent tonu),
önce `:root`'a ham değeri ekle, sonra `@theme` içine `--color-*` olarak
bağla.

## ⚠️ Cascade Layers Tuzağı

Tailwind v4, CSS'in native **cascade layers** (`@layer`) özelliğini
kullanır. Kritik kural şu: **layer'a sarılmamış ("unlayered") CSS her
zaman herhangi bir layer'daki CSS'ten önceliklidir — specificity bile
bunu değiştirmez.**

Bu projede `globals.css` içinde zaten `h1 { font-size: 28px; ... }` gibi
düz element selector'ları vardı. Eğer bunlar layer'sız bırakılsaydı, bir
`<h1 className="text-4xl">` yazdığında **Tailwind'in `text-4xl`
utility'si hiçbir zaman uygulanmazdı** — çünkü utility'ler
`@layer utilities` içinde, düz `h1` kuralıysa layer dışında ve layer
dışı kurallar her zaman kazanır.

Bunu önlemek için `globals.css`'teki tüm eski kurallar iki layer'a
taşındı:

- **`@layer base`** — element selector'ları: `*`, `html`/`body`, `a`,
  `h1`-`h3`, `p`, `pre`, `code`, `table`/`th`/`td`.
- **`@layer components`** — class tabanlı "component" stilleri: `.card`,
  `.badge`, `.callout`, `.route-list`, `.dashboard-shell`, `.form`,
  `button`/`.btn` vb.

Bu iki layer, Tailwind'in kendi `base`/`components` layer'larıyla **aynı
isimde** olduğu için birleşiyor (CSS layer semantiği budur) ve doğal
öncelik sırası şu hâle geliyor:

```
theme  <  base (Tailwind preflight + bizim element reset'lerimiz)
       <  components (bizim .card/.badge vb.)
       <  utilities (Tailwind'in bg-*, text-*, flex, grid ...)
```

Yani artık bir `<div className="card p-8">` yazarsan, Tailwind'in `p-8`
utility'si `.card`'ın kendi `padding: 20px`'ini gayet normal şekilde
override edebilir — tam da beklediğin gibi.

> **Kural:** `globals.css`'e yeni bir düz element selector'ı veya class
> tabanlı "component" stili eklerken, onu **mutlaka** `@layer base` ya
> da `@layer components` içine yaz. Layer'sız bırakırsan, o kural her
> Tailwind utility'sini ezer.

## Eski Class Sistemi ile Birlikte Kullanım

Bu entegrasyon **kademeli** düşünüldü: `styles/globals.css`'teki eski
class sistemi (`.card`, `.badge`, `.callout`, `.route-list`,
`.dashboard-shell`, `.kv`, `.form`, `.field`, `.error-box`,
`.loading-box` ...) hâlâ ~18 sayfada kullanılıyor ve **kaldırılmadı**.
Sadece artık `@layer components` içindeler, dolayısıyla:

- O sayfalar hiçbir değişiklik yapılmadan aynı görünümde çalışmaya
  devam ediyor.
- İstersen aynı elemente hem eski class'ı hem yeni bir Tailwind
  utility'sini birlikte yazabilirsin (`className="card md:p-8"` gibi).

## Modernize Edilen Ekranlar

Bu geçişte tamamen Tailwind utility'lerine taşınan kısımlar:

- **`components/Navbar.tsx`** — sticky + `backdrop-blur` header, gradient
  marka yazısı. Tüm case linkleri kaldırıldı (zaten ana sayfada kart
  olarak listeleniyor); sağ üstte oturum durumuna göre "Giriş yap" linki
  ya da kullanıcı adı/avatar + çıkış yap dropdown'u gösteriliyor
  (`/api/me` üzerinden `httpOnly` çerez server-side çözümleniyor).
- **`components/Footer.tsx`** — sadeleştirilmiş alt bilgi bandı.
- **`pages/_app.tsx`** — sayfa iskeleti (`flex min-h-screen flex-col`,
  ortalanmış `max-w-5xl` içerik alanı).
- **`pages/index.tsx`** — hero bölümü (gradient başlık, badge), route
  listesi artık kart grid'i (`grid sm:grid-cols-2`) olarak, hover'da
  hafif yükselme/gölge efektiyle.

Eski `layout-shell` / `site-header` / `site-main` / `site-footer` /
`brand` / `nav-links` class'ları sadece bu dosyalarda kullanıldığından,
Tailwind'e geçişle birlikte `globals.css`'ten tamamen kaldırıldı.

## Yeni Bir Sayfayı Tailwind'e Taşımak

1. Sayfadaki `.card`, `.badge`, `.route-list` gibi class'ları Tailwind
   utility karşılıklarıyla değiştir (renk/spacing için yukarıdaki
   `@theme` token'larını kullan: `bg-bg-card`, `border-border`,
   `text-text-dim`, `text-accent` ...).
2. Element selector'larına (`h1`, `p` ...) güveniyorsan ve override
   etmek istiyorsan, class ekle — `@layer base`'deki eski kurallar
   artık her zaman `@layer utilities`'ten **düşük öncelikli**, yani
   utility class'ların kazanacağından emin olabilirsin.
3. Sayfa tamamen taşındıysa ve artık hiçbir sayfa eski class'ı
   kullanmıyorsa, o class'ı `globals.css`'teki `@layer components`
   bloğundan silebilirsin (bkz. yukarıdaki "kullanılmayan class'ları
   temizleme" örneği — `layout-shell` vb. için yapıldı).

## Özet

| Konu | Durum |
| --- | --- |
| Tailwind sürümü | v4 (`tailwindcss`, `@tailwindcss/postcss`) |
| Config dosyası | Yok — `postcss.config.mjs` + `globals.css` içinde `@theme` yeterli |
| Bundler uyumu | Turbopack (varsayılan) ve `--webpack` fallback, ikisi de `postcss.config.mjs`'i okur |
| Eski `.card`/`.badge` sistemi | Korundu, `@layer components` içine taşındı |
| Tam Tailwind'e geçen dosyalar | `Navbar`, `Footer`, `_app.tsx`, `index.tsx` |
| Kritik gotcha | Yeni global CSS kuralların mutlaka `@layer base`/`@layer components` içinde olmalı, yoksa Tailwind utility'lerini ezer |
