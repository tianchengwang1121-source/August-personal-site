import Image from 'next/image'
import Link from 'next/link'
import BlogInteractions from '@/components/BlogInteractions'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

function BlogImage({ image, className = '' }) {
  const variantClass = image.variant
    ? ` blog-inline-image--${image.variant}`
    : ''

  return (
    <figure className={`blog-inline-image${variantClass} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt || image.caption}
        width={image.width}
        height={image.height}
        sizes="(max-width: 760px) calc(100vw - 56px), 760px"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  )
}

function BlogBlock({ block }) {
  if (block.type === 'paragraph') {
    return <p className="blog-paragraph">{block.text}</p>
  }

  if (block.type === 'media') {
    return (
      <div className="blog-media-row">
        <p className="blog-paragraph">{block.text}</p>
        <BlogImage image={{ ...block.image, variant: 'aside' }} />
      </div>
    )
  }

  if (block.type === 'gallery') {
    return (
      <div
        className={`blog-image-grid${
          block.variant ? ` blog-image-grid--${block.variant}` : ''
        }`}
      >
        {block.images.map((image) => (
          <BlogImage image={image} key={image.src} />
        ))}
      </div>
    )
  }

  if (block.type === 'image') {
    return <BlogImage image={block} />
  }

  return null
}

function BlogContent({ post }) {
  if (!post.content) {
    return <p className="blog-body">{post.body}</p>
  }

  return (
    <div className="blog-content">
      {post.content.map((section) => (
        <section
          className={`blog-story-section${
            section.layout ? ` blog-story-section--${section.layout}` : ''
          }`}
          key={section.title}
        >
          <h2>{section.title}</h2>
          {section.blocks.map((block, index) => (
            <BlogBlock block={block} key={`${section.title}-${index}`} />
          ))}
        </section>
      ))}
    </div>
  )
}

export default function BlogPost({ post }) {
  return (
    <Layout title={post.title}>
      <article className="blog-detail">
        <Link className="back-link" href="/blog">
          Back to Blog
        </Link>
        <div className="blog-detail-header">
          <p className="meta">
            {post.date} · {post.location}
          </p>
          <h1>{post.title}</h1>
          {post.tags && (
            <div className="blog-detail-tags" aria-label="Post tags">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="blog-hero-image">
          <Image
            src={post.image}
            alt={post.title}
            width={1350}
            height={1800}
            priority
            sizes="(max-width: 760px) calc(100vw - 56px), 920px"
          />
        </div>
        <BlogContent post={post} />
        <BlogInteractions slug={post.slug} />
      </article>
    </Layout>
  )
}

export function getStaticPaths() {
  return {
    paths: blogPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

export function getStaticProps({ params }) {
  const post = blogPosts.find((item) => item.slug === params.slug)

  return {
    props: {
      post,
    },
  }
}
