import Image from 'next/image'
import Link from 'next/link'
import JourneyGlobe from '@/components/JourneyGlobe'
import Layout from '@/components/Layout'
import { blogPosts, externalLinks, siteProfile } from '@/data/site'

function formatHomeDate(date) {
  return date
    .split('.')
    .map((part, index) => (index === 0 ? part : part.padStart(2, '0')))
    .join('.')
}

export default function Home() {
  const featuredPost =
    blogPosts.find((post) => post.slug === 'singapore-airshow') || blogPosts[0]
  const writingPreviewPosts = [
    featuredPost,
    ...blogPosts.filter((post) => post.slug !== featuredPost.slug),
  ].slice(0, 2)
  const timelinePreviewPosts = blogPosts.slice(0, 4)

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
          <div className="home-featured-list">
            {writingPreviewPosts.map((post) => (
              <Link
                className="home-featured-post"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <div className="home-featured-image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={360}
                    height={260}
                    sizes="(max-width: 760px) 96px, 124px"
                  />
                </div>
                <div className="home-featured-copy">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span>{formatHomeDate(post.date)}</span>
                </div>
                <span className="home-link-arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Current record</p>
            <h2>Timeline</h2>
          </div>
          <div className="home-timeline-list">
            {timelinePreviewPosts.map((post) => (
              <Link
                className="home-timeline-item"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <span className="home-timeline-dot" aria-hidden="true" />
                <div>
                  <time>{formatHomeDate(post.date)}</time>
                  <h3>{post.title}</h3>
                  <p>
                    {post.displayLocation || post.location}
                    {post.globe?.region &&
                    post.globe.region !== post.displayLocation
                      ? `, ${post.globe.region}`
                      : ''}
                  </p>
                </div>
                <span className="home-link-arrow" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  )
}
