import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

export default function Timeline() {
  return (
    <Layout title="Timeline">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow">Timeline</p>
          <h1>Experience records</h1>
          <div className="page-intro-meta" aria-label="Timeline categories">
            <span>Travel</span>
            <span>Aviation</span>
            <span>Records</span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>06</span>
          <strong>Logs</strong>
        </div>
      </section>
      <section className="timeline-page-list" aria-label="Experience timeline">
        {blogPosts.map((item, index) => (
          <article className="timeline-entry" key={item.slug}>
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
                <h2>{item.location}</h2>
                <p>{item.title}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </Layout>
  )
}
