import Head from "next/head";
import Link from "next/link";
import type {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { fetchPostBySlug, fetchPosts, type Post } from "@/lib/posts";

export default function BlogPost({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <Head>
        <title>{post.title}</title>
      </Head>
      <span className="badge">getStaticProps + getStaticPaths + ISR</span>
      <h1>{post.title}</h1>
      <p className="lede">
        {post.publishedAt} · route: <code>/blog/[slug]</code>
      </p>
      <div className="card">
        <p style={{ color: "var(--text)" }}>{post.content}</p>
      </div>
      <div className="callout" style={{ marginTop: 16 }}>
        <code>revalidate: 60</code> — bu sayfa 60 saniyede bir arka planda
        yeniden üretilir (ISR). <code>fallback: &apos;blocking&apos;</code>{" "}
        sayesinde build sırasında listede olmayan yeni bir slug&apos;a gidildiğinde
        Next.js sayfayı server&apos;da render edip cache&apos;ler.
      </div>
      <p style={{ marginTop: 16 }}>
        <Link href="/blog">← Tüm yazılar</Link>
      </p>
    </div>
  );
}

// Dynamic route için gerekli: build time'da hangi path'lerin
// önceden üretileceğini belirler.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts();

  const paths = posts.map((post) => ({
    params: { slug: post.id },
  }));

  return {
    paths,
    fallback: "blocking", // listede olmayan yeni slug'lar server'da render edilir
  };
};

export const getStaticProps: GetStaticProps<{ post: Post }> = async (
  context
) => {
  const slug = context.params?.slug as string;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    // pages/404.tsx'e yönlendirir
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
};
