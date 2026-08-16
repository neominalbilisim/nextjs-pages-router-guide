export interface Post {
	id: string;
	title: string;
	content: string;
	publishedAt: string;
}

const POSTS: Post[] = [
	{
		id: 'nextjs-guide',
		title: 'Next.js Pages Router Kapsamlı Kılavuz',
		content:
			"Pages Router, dosya tabanlı routing sunan Next.js'in klasik sistemidir. Bu yazı getStaticProps, getServerSideProps ve getInitialProps arasındaki farkları anlatır.",
		publishedAt: '2026-01-10',
	},
	{
		id: 'isr-explained',
		title: 'Incremental Static Regeneration Nasıl Çalışır?',
		content:
			"ISR, build time'da üretilen statik sayfaları belirli aralıklarla arka planda yeniden oluşturmanı sağlar. Bu sayede CDN hızı + güncel veri bir arada olur.",
		publishedAt: '2026-02-03',
	},
];

/** Build time'da (getStaticProps/getStaticPaths) çağrılan sahte API. */
export async function fetchPosts(): Promise<Post[]> {
	// Gerçek bir API çağrısını simüle etmek için küçük bir gecikme
	await new Promise((resolve) => setTimeout(resolve, 20));
	return POSTS;
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
	await new Promise((resolve) => setTimeout(resolve, 20));
	return POSTS.find((p) => p.id === slug) ?? null;
}
