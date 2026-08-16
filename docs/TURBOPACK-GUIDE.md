# ⚡ Turbopack Kullanımı

Bu döküman, bu projenin (**Next.js 16.3.1**, Pages Router) `next dev` ve
`next build` komutlarını çalıştırırken kullandığı **Turbopack** bundler'ını
anlatır: ne olduğunu, bu projede nasıl devrede olduğunu, hangi
yapılandırma seçeneklerinin bize gerçekten lazım olabileceğini ve webpack'e
kıyasla dikkat edilmesi gereken davranış farklarını.

> 📝 Kaynak: [node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md](../node_modules/next/dist/docs/01-app/03-api-reference/08-turbopack.md)
> ve [node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md).
> Bu içerik App ve Pages Router arasında paylaşılıyor; Pages Router'a özgü
> bir fark yok.

---

## 📑 İçindekiler

1. [Turbopack nedir?](#turbopack-nedir)
2. [Bu projede mevcut durum](#bu-projede-mevcut-durum)
3. [Webpack'e geri dönmek](#webpacke-geri-dönmek)
4. [Desteklenen özellikler (özet)](#desteklenen-özellikler-özet)
5. [`next.config.ts` içinde `turbopack` anahtarı](#nextconfigts-içinde-turbopack-anahtarı)
6. [Bu proje için ilgili senaryolar](#bu-proje-için-ilgili-senaryolar)
7. [Webpack'ten bilinen davranış farkları](#webpackten-bilinen-davranış-farkları)
8. [Sorun giderme](#sorun-giderme)
9. [Özet](#özet)

---

## Turbopack nedir?

Turbopack, Rust ile yazılmış, Next.js'e gömülü **incremental bundler**'dır.
Next.js 16'dan itibaren `next dev` ve `next build` için **varsayılan**
bundler'dır — yani bu projede herhangi bir ek kurulum yapmadan zaten
kullanılıyor. Öne çıkan noktalar:

- **Tek birleşik graph**: Client ve server ortamları ayrı derleyicilerle
  değil tek bir graph üzerinden yönetilir.
- **Dev'de bundling**: Native ESM'e güvenen bazı araçların aksine,
  Turbopack büyük uygulamalarda ağ isteği patlamasını önlemek için dev'de
  de bundle eder, ama bunu lazy şekilde yapar.
- **Incremental / cache'li**: İş, fonksiyon seviyesine kadar cache'lenir;
  aynı iş iki kez yapılmaz, sonuçlar diske de yazılır.
- **Lazy bundling**: Sadece dev server'ın o an istediği route/modül
  derlenir; bu da ilk derleme süresini ve bellek kullanımını azaltır.

## Bu projede mevcut durum

`package.json` script'lerine bakıldığında:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

`--webpack` bayrağı yok, dolayısıyla **hem `dev` hem `build` zaten
Turbopack ile çalışıyor**. Ayrıca `next.config.ts` içinde şu an bir
`turbopack: { ... }` bloğu yok — yani proje Turbopack'i tamamen
**zero-config** kullanıyor:

```ts
// next.config.ts (mevcut hali)
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ...
};
```

Bu, projenin CSS pipeline'ını da etkiliyor: [TAILWIND-CSS-GUIDE.md](TAILWIND-CSS-GUIDE.md)
dosyasında bahsedilen `postcss.config.mjs` dosyası Turbopack tarafından
proje kökünden otomatik okunuyor; Tailwind v4 için ayrıca bir
`turbopack.rules` tanımına gerek kalmıyor.

## Webpack'e geri dönmek

Bir sebeple webpack'e dönmek gerekirse (örn. desteklenmeyen bir webpack
plugin'i), `--webpack` bayrağı yeterli — kod değişikliği gerekmez:

```bash
npx next dev --webpack
npx next build --webpack
```

Kalıcı yapmak istersen `package.json` script'lerini güncelleyebilirsin,
ama bu projede şu an buna ihtiyaç yok.

## Desteklenen özellikler (özet)

Bu proje açısından önemli olanlar:

| Alan | Durum | Not |
| --- | --- | --- |
| TypeScript/TSX | ✅ Destekleniyor | Type-check Turbopack'te yapılmıyor; `tsc --watch` veya editör kontrolüne güveniyoruz. |
| CSS Modules | ✅ Destekleniyor | Lightning CSS ile native. |
| PostCSS | ✅ Destekleniyor | `postcss.config.mjs`/`.js`/`.ts` otomatik okunuyor (Tailwind için kullanılan yol). |
| Sass/SCSS | ✅ Destekleniyor | `sassOptions.functions` (custom JS fonksiyonları) desteklenmiyor. |
| Static asset import (`.png`, `.svg` vb.) | ✅ Destekleniyor | `<Image />` ile uyumlu obje döner. |
| Path alias'ları (`tsconfig.json` `paths`) | ✅ Destekleniyor | Ekstra config gerekmez. |
| `webpack()` config (`next.config.js` içindeki) | ❌ Desteklenmiyor | Turbopack bunun yerine `turbopack` anahtarını kullanır. |
| Webpack plugin'leri | ❌ Desteklenmiyor | Sadece webpack loader'ları (kısıtlı API ile) destekleniyor. |

## `next.config.ts` içinde `turbopack` anahtarı

Bu proje şu an bu anahtarı kullanmıyor, ama ileride ihtiyaç olursa
`next.config.ts` içine şu şekilde eklenir:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Proje kökünü manuel sabitlemek (bkz. aşağıdaki "Filesystem Root" notu)
    // root: __dirname,

    // webpack'teki resolve.alias karşılığı
    // resolveAlias: {
    //   "@/legacy": "./legacy-utils",
    // },

    // .svg gibi dosyaları React component'i olarak import etmek için
    // rules: {
    //   "*.svg": {
    //     loaders: ["@svgr/webpack"],
    //     as: "*.js",
    //   },
    // },
  },
};

export default nextConfig;
```

Önemli seçenekler:

- **`root`** — Turbopack'in modül çözümlemesi için kullandığı kök dizin.
  Next.js bunu `package-lock.json` (bu projede mevcut) gibi dosyalara
  bakarak otomatik buluyor; monorepo değiliz, dolayısıyla manuel set
  etmeye gerek yok.
- **`rules`** — Belirli webpack loader'larını (örn. `@svgr/webpack`,
  `raw-loader`, `yaml-loader`) dosya uzantısına göre bağlamak için.
- **`resolveAlias`** / **`resolveExtensions`** — webpack'in
  `resolve.alias` / `resolve.extensions` karşılığı.

## Bu proje için ilgili senaryolar

### SVG'yi component olarak import etmek

Proje şu an `.svg` dosyalarını `<Image />`/`<img>` ile URL olarak
kullanıyorsa (asset import), ekstra config gerekmiyor — bu zaten
zero-config destekleniyor. Eğer ileride bir SVG'yi React component'i
gibi import etmek istersen (`import Logo from "./logo.svg"` → JSX),
`@svgr/webpack`'i kurup yukarıdaki `rules` örneğini eklemen gerekir;
aksi halde Turbopack SVG'yi düz asset olarak ele alır.

### PostCSS config'in okunma sırası

Varsayılan olarak Turbopack `postcss.config.mjs`'i proje kökünden okur.
`turbopackLocalPostcssConfig` deneysel bayrağı (`experimental` altında)
açılırsa, önce CSS dosyasının bulunduğu dizinde config arar. Bu projede
tek bir global `postcss.config.mjs` olduğu için bu bayrağa ihtiyaç yok.

### Filesystem Root uyarısı

Turbopack, proje kökü dışındaki dosyaları resolve etmez. `npm link` /
`yarn link` ile dışarıdan bir paket bağlamadığımız sürece bu projede bir
etkisi yok; eğer ileride local bir paketi link'lersen ve Turbopack onu
bulamazsa, `turbopack.root`'u linklenen paketle bu projenin ortak üst
dizinine ayarlaman gerekir.

## Webpack'ten bilinen davranış farkları

Yeni bir proje olduğumuz için çoğu bu listeden etkilenmiyoruz, ama ileride
webpack'ten gelen bir kod parçası taşınırsa akılda tutulmalı:

- **CSS Modules sırası**: Turbopack, sırasız CSS modüllerini JS import
  sırasına göre diziyor. Webpack bazı durumlarda (side-effect-free
  tespit edilen dosyalarda) bu sırayı görmezden gelebiliyordu. Stil
  çakışması yaşarsan, hangi CSS'in önce yüklenmesi gerektiğini import
  sırasıyla veya `@import` ile netleştir.
- **Sass `~` söz dizimi**: `@import '~bootstrap/...'` gibi tilde
  içeren import'lar Turbopack'te desteklenmiyor; doğrudan
  `@import 'bootstrap/...'` yazılmalı (bu proje Sass kullanmıyor, ama
  ileride eklenirse geçerli).
- **CSS ondalık hassasiyeti**: Lightning CSS 5 basamak kullanıyor,
  webpack 10 basamak kullanıyordu (`line-height` gibi hesaplanan
  değerlerde küçük farklar olabilir).
- **`webpack()` fonksiyonu**: `next.config.ts` içinde bir `webpack(config) {}`
  fonksiyonu tanımlarsan, Turbopack bunu **yok sayar**. Bunun yerine
  `turbopack` anahtarını kullanmak gerekir.

## Sorun giderme

Performans veya bellek sorunu yaşarsan, trace dosyası üretip Next.js
repo'suna issue açarken ekleyebilirsin:

```bash
npx next dev --internal-trace
```

Bu, `.next-profiles/trace-turbopack.bin` dosyasını üretir.

Desteklenmeyen platformlarda (örn. FreeBSD/OpenBSD — bu projeyi
geliştirdiğimiz Windows x64 için native binding zaten mevcut ve sorun
yok) Turbopack native binding bulunamazsa Next.js otomatik olarak WASM
fallback'ine geçer; bu fallback sadece temel SWC derleme/minify
yapabilir, **Turbopack'i desteklemez** — böyle bir durumda `--webpack`
bayrağı kullanılmalı.

## Özet

- Bu proje Next.js 16.3.1 ile **zero-config Turbopack** kullanıyor;
  `next dev` ve `next build` için ayrı bir bayrak veya `turbopack`
  config'i gerekmiyor.
- Tailwind v4 + PostCSS entegrasyonu ([TAILWIND-CSS-GUIDE.md](TAILWIND-CSS-GUIDE.md))
  Turbopack'in `postcss.config.mjs`'i otomatik okuma davranışına
  dayanıyor.
- `next.config.ts` içine `turbopack: { rules, resolveAlias, root, ... }`
  eklemek istersen yukarıdaki örnekler başlangıç noktası olabilir.
- Webpack'e dönmek gerekirse tek yapman gereken `--webpack` bayrağı.
