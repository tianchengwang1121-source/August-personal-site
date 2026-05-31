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
      <section className="timeline-list timeline-page-list">
        {blogPosts.map((item, index) => (
          <Link
            className="timeline-entry-card"
            href={`/blog/${item.slug}`}
            key={item.slug}
          >
            <div className="timeline-entry-image">
              <Image
                src={item.image}
                alt={item.title}
                width={520}
                height={360}
              />
            </div>
            <div className="timeline-entry-content">
              <p className="meta">{item.date}</p>
              <h2>{item.location}</h2>
              <p>{item.title}</p>
            </div>
            <span className="timeline-entry-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
          </Link>
        ))}
      </section>
    </Layout>
  )
}
