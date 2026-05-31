import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

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
        </div>
        <div className="blog-hero-image">
          <Image
            src={post.image}
            alt={post.title}
            width={1600}
            height={1060}
            priority
          />
        </div>
        <p className="blog-body">{post.body}</p>
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
