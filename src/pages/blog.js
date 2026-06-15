import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'
import { getThemedPost } from '@/data/themeCopy'

export default function Blog() {
  return (
    <Layout title="Blog">
      {(theme) => (
      <>
        <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow theme-has-neon">
            <span className="theme-copy-classic">Blog</span>
            <span className="theme-copy-neon">LOG FEED</span>
            <span className="theme-copy-ink">札记</span>
          </p>
          <h1 className="theme-has-neon">
            <span className="theme-copy-classic">Notes</span>
            <span className="theme-copy-neon">FIELD NOTES</span>
            <span className="theme-copy-ink">云程杂录</span>
          </h1>
          <div className="page-intro-meta" aria-label="Blog categories">
            <span>
              <span className="theme-copy-classic">Travel</span>
              <span className="theme-copy-ink">行旅</span>
            </span>
            <span>
              <span className="theme-copy-classic">Photos</span>
              <span className="theme-copy-ink">影像</span>
            </span>
            <span>
              <span className="theme-copy-classic">Aviation</span>
              <span className="theme-copy-ink">航空</span>
            </span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>06</span>
          <strong>
            <span className="theme-copy-classic">Posts</span>
            <span className="theme-copy-ink">卷</span>
          </strong>
        </div>
      </section>
      <section className="blog-grid">
        {blogPosts.map((post) => {
          const displayPost = getThemedPost(post, theme)

          return (
            <Link
              className="blog-card"
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <div className="blog-card-image">
                <Image
                  src={post.image}
                  alt={displayPost.title}
                  width={900}
                  height={680}
                />
              </div>
              <div className="blog-card-content">
                <p className="meta">
                  {post.date} · {displayPost.location}
                </p>
                <h2>{displayPost.title}</h2>
                <p>{displayPost.excerpt}</p>
              </div>
            </Link>
          )
        })}
      </section>
      </>
      )}
    </Layout>
  )
}
