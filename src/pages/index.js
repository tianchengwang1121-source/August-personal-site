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
      <>
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow home-label-classic theme-has-neon">
              <span className="theme-copy-classic">Personal homepage</span>
              <span className="theme-copy-neon">NODE: HOME / ARCHIVE ONLINE</span>
            </p>
            <p className="eyebrow home-label-ink">清游小记</p>
            <h1>
              <span className="home-name-classic theme-has-neon">
                <span className="theme-copy-classic">{siteProfile.name}</span>
                <span className="theme-copy-neon">AUGUST.EXE</span>
              </span>
              <span className="home-name-ink">王天诚</span>
            </h1>
            <div className="hero-profile" aria-label="Education background">
              <p className="home-copy-classic theme-has-neon">
                <span className="theme-copy-classic">{siteProfile.education.school}</span>
                <span className="theme-copy-neon">POLYU / AAE / HKG</span>
              </p>
              <p className="home-copy-classic theme-has-neon">
                <span className="theme-copy-classic">{siteProfile.education.program}</span>
                <span className="theme-copy-neon">FLIGHT · CITY · CAMERA · SIGNAL</span>
              </p>
              <p className="home-copy-ink">香江问学，云端逐翼。</p>
              <p className="home-copy-ink">以镜收山海，以笔记风尘。</p>
            </div>
            <div className="hero-actions" aria-label="Featured sections">
              <Link href="/blog">
                <span className="home-copy-classic">Read Blog</span>
                <span className="home-copy-ink">读札记</span>
              </Link>
              <Link href="/timeline">
                <span className="home-copy-classic">View Timeline</span>
                <span className="home-copy-ink">览行年</span>
              </Link>
              <a
                href={externalLinks.jetphotos.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="home-copy-classic">JetPhotos</span>
                <span className="home-copy-ink">航影</span>
              </a>
            </div>
          </div>
          <div
            className="hero-art-card"
            aria-label="Personal Archive visual"
            tabIndex={0}
          >
            <div className="art-orbit art-orbit-large" aria-hidden="true" />
            <div className="art-orbit art-orbit-small" aria-hidden="true" />
            <div className="art-axis art-axis-one" aria-hidden="true" />
            <div className="art-axis art-axis-two" aria-hidden="true" />
            <div className="art-glass-panel">
              <span className="home-copy-classic">Personal</span>
              <span className="home-copy-ink">一卷</span>
              <strong>
                <span className="home-copy-classic">Archive</span>
                <span className="home-copy-ink">行藏</span>
              </strong>
            </div>
            <div className="art-tags" aria-label="Archive topics">
              <span>
                <span className="home-copy-classic">Travel</span>
                <span className="home-copy-ink">远游</span>
              </span>
              <span>
                <span className="home-copy-classic">Photos</span>
                <span className="home-copy-ink">影存</span>
              </span>
              <span>
                <span className="home-copy-classic">Stories</span>
                <span className="home-copy-ink">短章</span>
              </span>
              <span>
                <span className="home-copy-classic">Projects</span>
                <span className="home-copy-ink">器作</span>
              </span>
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
      </>
    </Layout>
  )
}
