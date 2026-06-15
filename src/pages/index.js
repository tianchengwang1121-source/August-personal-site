import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import JourneyGlobe from '@/components/JourneyGlobe'
import Layout from '@/components/Layout'
import { blogPosts, externalLinks, siteProfile } from '@/data/site'

const homeThemes = [
  { id: 'classic', label: 'Classic', note: 'quiet archive' },
  { id: 'neon', label: 'Neon', note: 'future signal' },
  { id: 'ink', label: 'Ink', note: 'brush garden' },
]

const themeStorageKey = 'august-home-theme'

function formatHomeDate(date) {
  return date
    .split('.')
    .map((part, index) => (index === 0 ? part : part.padStart(2, '0')))
    .join('.')
}

export default function Home() {
  const [theme, setTheme] = useState('classic')
  const [pointer, setPointer] = useState({ x: 50, y: 34 })
  const [keyBursts, setKeyBursts] = useState([])
  const featuredPost =
    blogPosts.find((post) => post.slug === 'singapore-airshow') || blogPosts[0]
  const writingPreviewPosts = [
    featuredPost,
    ...blogPosts.filter((post) => post.slug !== featuredPost.slug),
  ].slice(0, 2)
  const timelinePreviewPosts = blogPosts.slice(0, 4)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey)

    if (homeThemes.some((item) => item.id === storedTheme)) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(themeStorageKey, theme)
    document.documentElement.dataset.homeTheme = theme

    return () => {
      delete document.documentElement.dataset.homeTheme
    }
  }, [theme])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (theme === 'classic' || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const key =
        event.key.length === 1 ? event.key.toUpperCase() : event.key.replace('Arrow', '')
      const burst = {
        id: `${Date.now()}-${Math.random()}`,
        key,
        x: 14 + Math.random() * 72,
        y: 18 + Math.random() * 54,
      }

      setKeyBursts((items) => [...items.slice(-9), burst])
      window.setTimeout(() => {
        setKeyBursts((items) => items.filter((item) => item.id !== burst.id))
      }, 1100)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme])

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <Layout title="Home">
      <div
        className="home-theme-stage"
        data-home-theme={theme}
        onMouseMove={handlePointerMove}
        style={{
          '--cursor-x': `${pointer.x}%`,
          '--cursor-y': `${pointer.y}%`,
          '--tilt-x': `${(pointer.y - 50) * -0.035}deg`,
          '--tilt-y': `${(pointer.x - 50) * 0.035}deg`,
          '--drift-x': `${(pointer.x - 50) * 0.02}px`,
          '--drift-y': `${(pointer.y - 50) * 0.02}px`,
        }}
      >
        <div className="theme-backdrop" aria-hidden="true">
          <span className="theme-orb theme-orb-one" />
          <span className="theme-orb theme-orb-two" />
          <span className="theme-calligraphy">August</span>
          <span className="theme-scanline" />
        </div>

        <div className="theme-key-layer" aria-hidden="true">
          {keyBursts.map((burst) => (
            <span
              className="theme-key-burst"
              key={burst.id}
              style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
              }}
            >
              {burst.key}
            </span>
          ))}
        </div>

        <section className="theme-console" aria-label="Homepage theme selector">
          <div>
            <p className="eyebrow">Visual mode</p>
            <strong>{homeThemes.find((item) => item.id === theme)?.label}</strong>
          </div>
          <div className="theme-switcher" role="group" aria-label="Choose homepage theme">
            {homeThemes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={theme === item.id ? 'theme-option is-active' : 'theme-option'}
                onClick={() => setTheme(item.id)}
                aria-pressed={theme === item.id}
                title={item.note}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

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
      </div>
    </Layout>
  )
}
