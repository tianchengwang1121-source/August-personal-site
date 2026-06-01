import { useEffect, useMemo, useState } from 'react'
import Layout from '@/components/Layout'
import { blogPosts } from '@/data/site'

const dateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(value) {
  try {
    return dateFormatter.format(new Date(value))
  } catch {
    return ''
  }
}

export default function CommentAdmin() {
  const [adminPassword, setAdminPassword] = useState('')
  const [commentsByPost, setCommentsByPost] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const totalComments = useMemo(
    () =>
      Object.values(commentsByPost).reduce(
        (total, comments) => total + comments.length,
        0
      ),
    [commentsByPost]
  )

  useEffect(() => {
    const storedPassword = window.sessionStorage.getItem('blog-admin-password')

    if (storedPassword) {
      setAdminPassword(storedPassword)
    }
  }, [])

  function loadComments(event) {
    event?.preventDefault()

    setIsLoading(true)
    setStatusMessage('')

    Promise.all(
      blogPosts.map((post) =>
        fetch(`/api/blog-interactions/${post.slug}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load comments')
            }

            return response.json()
          })
          .then((data) => [post.slug, data.comments || []])
      )
    )
      .then((entries) => {
        window.sessionStorage.setItem('blog-admin-password', adminPassword)
        setCommentsByPost(Object.fromEntries(entries))
      })
      .catch(() => {
        setStatusMessage('Comments could not be loaded.')
      })
      .finally(() => setIsLoading(false))
  }

  function deleteComment(postSlug, commentId) {
    if (!adminPassword.trim()) {
      setStatusMessage('Admin password is required.')
      return
    }

    fetch(`/api/blog-interactions/${postSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete-comment',
        adminPassword,
        commentId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete comment')
        }

        return response.json()
      })
      .then((data) => {
        setCommentsByPost((current) => ({
          ...current,
          [postSlug]: data.comments || [],
        }))
        setStatusMessage('Comment deleted.')
      })
      .catch(() => {
        setStatusMessage('Comment could not be deleted. Check the admin password.')
      })
  }

  return (
    <Layout title="Comment Admin">
      <section className="admin-comments">
        <div className="admin-comments-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Comment control</h1>
          </div>
          <strong>{totalComments} comments</strong>
        </div>

        <form className="admin-password-form" onSubmit={loadComments}>
          <label htmlFor="admin-password">Admin password</label>
          <div>
            <input
              id="admin-password"
              onChange={(event) => setAdminPassword(event.target.value)}
              placeholder="Enter admin password"
              type="password"
              value={adminPassword}
            />
            <button disabled={isLoading} type="submit">
              {isLoading ? 'Loading' : 'Load comments'}
            </button>
          </div>
        </form>

        {statusMessage && <p className="admin-status">{statusMessage}</p>}

        <div className="admin-comment-groups">
          {blogPosts.map((post) => {
            const comments = commentsByPost[post.slug] || []

            return (
              <section className="admin-comment-group" key={post.slug}>
                <div className="admin-comment-group-heading">
                  <div>
                    <span>{post.date}</span>
                    <h2>{post.title}</h2>
                  </div>
                  <strong>{comments.length}</strong>
                </div>

                {comments.length === 0 ? (
                  <p className="admin-empty">No comments.</p>
                ) : (
                  <div className="admin-comment-list">
                    {comments.map((comment) => (
                      <article className="admin-comment" key={comment.id}>
                        <div className="admin-comment-meta">
                          <div>
                            <strong>{comment.name}</strong>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                          <button
                            onClick={() => deleteComment(post.slug, comment.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                        <p>{comment.text}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}
