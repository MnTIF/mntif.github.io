import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getPost } from '@/lib/blog-posts'

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <div className="term-shell">
      <header className="term-head" role="banner">
        <Link className="term-brand" href="/">
          <span className="term-brand-prompt">mtif</span>
          <span className="term-brand-sep">:</span>
          <span className="term-brand-path">~/blog/{post.slug}</span>
          <span className="term-brand-sep">$</span>
        </Link>
        <nav className="term-chips" aria-label="Navigation">
          <Link href="/blog/" className="term-chip">
            blog
          </Link>
          <Link href="/" className="term-chip">
            home
          </Link>
        </nav>
      </header>

      <main className="blog-shell">
        <article
          className="blog-article"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </main>
    </div>
  )
}
