import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

export default function Blog() {
  return (
    <Layout title="Blog">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow">Blog</p>
          <h1>Notes</h1>
          <div className="page-intro-meta" aria-label="Blog categories">
            <span>Travel</span>
            <span>Photos</span>
            <span>Aviation</span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>06</span>
          <strong>Posts</strong>
        </div>
      </section>
      <section className="blog-grid">
        {blogPosts.map((post) => (
          <Link
            className="blog-card"
            href={`/blog/${post.slug}`}
            key={post.slug}
          >
            <div className="blog-card-image">
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={680}
              />
            </div>
            <div className="blog-card-content">
              <p className="meta">
                {post.date} · {post.location}
              </p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </Layout>
  )
}
