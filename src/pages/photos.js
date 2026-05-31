import Image from 'next/image'
import Layout from '@/components/Layout'
import { photoCollections } from '@/data/photos'

export default function Photos() {
  return (
    <Layout title="Photos">
      <section className="page-intro">
        <div className="page-intro-main">
          <p className="eyebrow">Photos</p>
          <h1>Photo archive</h1>
          <div className="page-intro-meta" aria-label="Photo categories">
            <span>Street</span>
            <span>Aircraft</span>
            <span>Landscape</span>
          </div>
        </div>
        <div className="page-intro-mark" aria-hidden="true">
          <span>18</span>
          <strong>Photos</strong>
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
              <span>{collection.count} photos</span>
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
