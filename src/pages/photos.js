import Image from 'next/image'
import Layout from '@/components/Layout'
import { photoCollections } from '@/data/photos'

export default function Photos() {
  return (
    <Layout title="Photos">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow theme-has-neon">
            <span className="theme-copy-classic">Photos</span>
            <span className="theme-copy-neon">IMAGE BANK</span>
            <span className="theme-copy-ink">影集</span>
          </p>
          <h1 className="theme-has-neon">
            <span className="theme-copy-classic">Photo archive</span>
            <span className="theme-copy-neon">VISUAL CACHE</span>
            <span className="theme-copy-ink">光影留痕</span>
          </h1>
          <div className="page-intro-meta" aria-label="Photo categories">
            <span>
              <span className="theme-copy-classic">Street</span>
              <span className="theme-copy-ink">街巷</span>
            </span>
            <span>
              <span className="theme-copy-classic">Aircraft</span>
              <span className="theme-copy-ink">飞羽</span>
            </span>
            <span>
              <span className="theme-copy-classic">Landscape</span>
              <span className="theme-copy-ink">山川</span>
            </span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>18</span>
          <strong>
            <span className="theme-copy-classic">Photos</span>
            <span className="theme-copy-ink">帧</span>
          </strong>
        </div>
      </section>

      <section className="photo-collections" aria-label="Photo collections">
        {photoCollections.map((collection, collectionIndex) => (
          <section className="photo-section panel" key={collection.id}>
            <div className="photo-section-heading">
              <div>
                <p className="eyebrow">{collection.label}</p>
                <h2>{collection.title}</h2>
              </div>
              <span>
                <span className="theme-copy-classic">{collection.count} photos</span>
                <span className="theme-copy-ink">{collection.count} 帧</span>
              </span>
            </div>
            <div className="photo-masonry">
              {collection.images.map((image, index) => (
                <figure
                  className="photo-frame"
                  key={image.src}
                  style={{ '--photo-aspect': `${image.width} / ${image.height}` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    priority={collectionIndex === 0}
                    loading={collectionIndex === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 760px) calc(100vw - 88px), (max-width: 1120px) calc((100vw - 92px) / 2), 340px"
                  />
                </figure>
              ))}
            </div>
          </section>
        ))}
      </section>
    </Layout>
  )
}
