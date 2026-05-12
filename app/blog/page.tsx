import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog-posts'

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="term-shell">
      <header className="term-head" role="banner">
        <Link className="term-brand" href="/">
          <span className="term-brand-prompt">mtif</span>
          <span className="term-brand-sep">:</span>
          <span className="term-brand-path">~/blog</span>
          <span className="term-brand-sep">$</span>
        </Link>
        <nav className="term-chips" aria-label="Navigation">
          <Link href="/" className="term-chip">
            home
          </Link>
        </nav>
      </header>

      <main className="blog-shell">
        <header className="blog-hero">
          <h1>Field notes.</h1>
          <p>
            Conversations, event notes, and venture-building observations from
            the M&amp;T Innovation Fund community.
          </p>
        </header>

        <ul className="blog-index">
          {posts.map((post) => (
            <li key={post.slug} className="blog-index-item">
              <Link href={`/blog/${post.slug}/`}>
                <span className="blog-index-date">{post.date}</span>
                <span className="blog-index-title">{post.title}</span>
                <span className="blog-index-summary">{post.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
