import Head from 'next/head'
import Navbar from './Navbar'
import SiteStats from './SiteStats'
import { blogPosts, siteProfile } from '@/data/site'
import { photoCollections } from '@/data/photos'

const totalPhotos = photoCollections.reduce(
  (total, collection) => total + collection.images.length,
  0
)

const footerStats = [
  { value: blogPosts.length, label: 'Posts' },
  { value: totalPhotos, label: 'Photos' },
  { value: '2026', label: 'Since' },
  { value: 'Archive', label: 'Status' },
]

export default function Layout({ title, description, children }) {
  const pageTitle = title ? `${title} | ${siteProfile.name}` : siteProfile.name
  const metaDescription = description || siteProfile.description

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/favicon.svg?v=black-triangle-20260531"
          type="image/svg+xml"
        />
      </Head>
      <Navbar />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="footer-signature">
          <span>© 2026 {siteProfile.name}</span>
          <span>Personal homepage and archive.</span>
        </div>
        <SiteStats staticStats={footerStats} />
      </footer>
    </>
  )
}
