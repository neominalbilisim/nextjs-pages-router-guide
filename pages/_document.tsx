import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";

class MyDocument extends Document {
  // getInitialProps burada "legacy" değil: _document.tsx için hâlâ
  // TEK ve DOĞRU API budur. getStaticProps/getServerSideProps sadece
  // sayfa (page) component'lerinde çalışır, Document'te desteklenmez.
  // Bu method olmadan Next.js styled-components/emotion gibi CSS-in-JS
  // kütüphanelerinin style'larını SSR sırasında toplayamaz.
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="tr">
        <Head>
          {/* Custom fonts (Next.js 13 öncesi Pages Router yöntemi) */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#0b0d12" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
