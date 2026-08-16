import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { fetchPosts, type Post } from "@/lib/posts";

export default function BlogIndex({
  posts,
  generatedAt,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <Head>
        <title>Blog</title>
      </Head>
      <span className="badge">getStaticProps (SSG)</span>
      <h1>Blog</h1>
      <p className="lede">
        Bu liste <strong>build time&apos;da</strong> (npm run build)
        oluşturuldu. Sayfa HTML&apos;i CDN&apos;de cache&apos;lenebilir.
      </p>
      <div className="callout">
        Bu sayfa üretildiğinde zaman: <code>{generatedAt}</code> — sayfayı
        yenile, dev modda her request&apos;te değişecek ama{" "}
        <code>npm run build</code> sonrası sabit kalacak (ta ki yeniden build
        edene kadar).
      </div>

      <h2>Yazılar</h2>
      <ul className="route-list">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`} style={{ fontWeight: 600 }}>
              {post.title}
            </Link>
            <div className="desc">
              {post.publishedAt} — {post.content.slice(0, 90)}...
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Build time'da çalışır
export const getStaticProps: GetStaticProps<{
  posts: Post[];
  generatedAt: string;
}> = async () => {
  const posts = await fetchPosts();

  return {
    props: {
      posts,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 60, // ISR: 60 saniyede bir arka planda yeniden üret
  };
};
