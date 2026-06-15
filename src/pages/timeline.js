import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

function getPostYear(date) {
  return date.split('.')[0]
}

export default function Timeline() {
  return (
    <Layout title="Timeline">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow">
            <span className="theme-copy-classic">Timeline</span>
            <span className="theme-copy-ink">行年</span>
          </p>
          <h1>
            <span className="theme-copy-classic">Experience records</span>
            <span className="theme-copy-ink">岁月行藏</span>
          </h1>
          <div className="page-intro-meta" aria-label="Timeline categories">
            <span>
              <span className="theme-copy-classic">Travel</span>
              <span className="theme-copy-ink">远游</span>
            </span>
            <span>
              <span className="theme-copy-classic">Aviation</span>
              <span className="theme-copy-ink">逐翼</span>
            </span>
            <span>
              <span className="theme-copy-classic">Records</span>
              <span className="theme-copy-ink">纪事</span>
            </span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>06</span>
          <strong>
            <span className="theme-copy-classic">Logs</span>
            <span className="theme-copy-ink">记</span>
          </strong>
        </div>
      </section>
      <section className="timeline-page-list" aria-label="Experience timeline">
        {blogPosts.map((item, index) => {
          const year = getPostYear(item.date)
          const previousYear =
            index > 0 ? getPostYear(blogPosts[index - 1].date) : null
          const showYearMarker = year !== previousYear

          return (
            <article className="timeline-entry" key={item.slug}>
              {showYearMarker && (
                <div className="timeline-year-marker" aria-label={`${year} records`}>
                  <span>{year}</span>
                </div>
              )}
              <div className="timeline-marker" aria-hidden="true">
                <span className="timeline-entry-date">{item.date}</span>
                <span className="timeline-entry-dot" />
              </div>
              <Link className="timeline-entry-card" href={`/blog/${item.slug}`}>
                <div className="timeline-entry-image">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={520}
                    height={360}
                  />
                </div>
                <div className="timeline-entry-content">
                  <span className="timeline-entry-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="eyebrow">{item.category}</p>
                  <h2>{item.displayLocation || item.location}</h2>
                  <p>{item.title}</p>
                </div>
              </Link>
            </article>
          )
        })}
      </section>
    </Layout>
  )
}
