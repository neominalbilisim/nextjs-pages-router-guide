import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

/**
 * Pattern 2: Per-Page Layout (döküman "Layout Patterns" bölümü).
 * Her sayfa isteğe bağlı olarak kendi `getLayout` fonksiyonunu tanımlar;
 * _app.tsx bunu çağırıp sayfayı o layout'a sarar. Layout, page geçişlerinde
 * unmount olmadığı için state (ör. sidebar scroll pozisyonu) korunur.
 */
export type NextPageWithLayout<P = Record<string, never>, IP = P> =
  NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
