import Link from 'next/link'
import JourneyGlobe from '@/components/JourneyGlobe'
import Layout from '@/components/Layout'
import { blogPosts, externalLinks, siteProfile, timelineItems } from '@/data/site'

export default function Home() {
  return (
    <Layout title="Home">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Personal homepage</p>
          <h1>{siteProfile.name}</h1>
          <div className="hero-profile" aria-label="Education background">
            <p>{siteProfile.education.school}</p>
            <p>{siteProfile.education.program}</p>
          </div>
          <div className="hero-actions" aria-label="Featured sections">
            <Link href="/blog">Read Blog</Link>
            <Link href="/timeline">View Timeline</Link>
            <a
              href={externalLinks.jetphotos.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              JetPhotos
            </a>
          </div>
        </div>
        <div className="hero-art-card" aria-label="Personal Archive visual">
          <div className="art-orbit art-orbit-large" aria-hidden="true" />
          <div className="art-orbit art-orbit-small" aria-hidden="true" />
          <div className="art-axis art-axis-one" aria-hidden="true" />
          <div className="art-axis art-axis-two" aria-hidden="true" />
          <div className="art-glass-panel">
            <span>Personal</span>
            <strong>Archive</strong>
          </div>
          <div className="art-tags" aria-label="Archive topics">
            <span>Travel</span>
            <span>Photos</span>
            <span>Stories</span>
            <span>Projects</span>
          </div>
        </div>
      </section>

      <JourneyGlobe posts={blogPosts} />

      <section className="section-grid" aria-label="Homepage overview">
        <article className="panel large-panel">
          <div className="section-heading">
            <p className="eyebrow">Latest writing</p>
            <h2>Blog</h2>
          </div>
          <div className="post-list home-blog-scroll" aria-label="Latest blog posts">
            {blogPosts.map((post) => (
              <Link
                className="post-row"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <div>
                  <p className="meta">
                    {post.date} · {post.category}
                  </p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Current record</p>
            <h2>Timeline</h2>
          </div>
          {timelineItems.map((item) => (
            <Link
              className="timeline-row timeline-link-row"
              href={item.href}
              key={item.href}
            >
              <span>{item.date}</span>
              <div>
                <h3>{item.location}</h3>
              </div>
            </Link>
          ))}
        </article>
      </section>
    </Layout>
  )
}
