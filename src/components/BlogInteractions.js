import { useEffect, useMemo, useState } from 'react'

const displayDateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatCommentDate(value) {
  try {
    return displayDateFormatter.format(new Date(value))
  } catch {
    return ''
  }
}

function getStoredName() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem('blog-comment-name') || ''
}

function getStoredLike(slug) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(`blog-liked-${slug}`) === 'true'
}

export default function BlogInteractions({ slug }) {
  const endpoint = useMemo(() => `/api/blog-interactions/${slug}`, [slug])
  const [comments, setComments] = useState([])
  const [draft, setDraft] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [name, setName] = useState('')
  const [pendingComment, setPendingComment] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    setIsLiked(getStoredLike(slug))
    setName(getStoredName())

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load interactions')
        }

        return response.json()
      })
      .then((data) => {
        if (!isMounted) {
          return
        }

        setLikeCount(data.likes || 0)
        setComments(data.comments || [])
      })
      .catch(() => {
        if (isMounted) {
          setStatusMessage('Interactions are temporarily unavailable.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [endpoint, slug])

  function updateStoredLike(value) {
    window.localStorage.setItem(`blog-liked-${slug}`, String(value))
  }

  function handleLike() {
    const nextLiked = !isLiked

    setIsLiked(nextLiked)
    updateStoredLike(nextLiked)
    setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)))
    setStatusMessage('')

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: nextLiked ? 'like' : 'unlike' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update like')
        }

        return response.json()
      })
      .then((data) => {
        setLikeCount(data.likes || 0)
      })
      .catch(() => {
        const reverted = !nextLiked
        setIsLiked(reverted)
        updateStoredLike(reverted)
        setLikeCount((count) => Math.max(0, count + (nextLiked ? -1 : 1)))
        setStatusMessage('Like could not be saved. Please try again.')
      })
  }

  function submitComment(commentName, commentText) {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'comment',
        name: commentName,
        text: commentText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to publish comment')
        }

        return response.json()
      })
      .then((data) => {
        setComments(data.comments || [])
        setDraft('')
        setPendingComment('')
        setStatusMessage('')
      })
      .catch(() => {
        setStatusMessage('Comment could not be published. Please try again.')
      })
  }

  function handleCommentSubmit(event) {
    event.preventDefault()

    const trimmedDraft = draft.trim()
    const storedName = name.trim()

    if (!trimmedDraft) {
      return
    }

    if (!storedName) {
      setPendingComment(trimmedDraft)
      setIsNameDialogOpen(true)
      return
    }

    submitComment(storedName, trimmedDraft)
  }

  function handleNameSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const nextName = String(formData.get('name') || '').trim()

    if (!nextName) {
      return
    }

    window.localStorage.setItem('blog-comment-name', nextName)
    setName(nextName)
    setIsNameDialogOpen(false)
    submitComment(nextName, pendingComment || draft.trim())
  }

  return (
    <section className="blog-interactions" aria-label="Blog interactions">
      <div className="blog-interactions-header">
        <div>
          <p className="eyebrow">Responses</p>
          <h2>Leave a trace</h2>
        </div>
        <button
          className={`blog-like-button${isLiked ? ' is-liked' : ''}`}
          disabled={isLoading}
          onClick={handleLike}
          type="button"
        >
          <span aria-hidden="true">♥</span>
          <strong>{likeCount}</strong>
          <em>{likeCount === 1 ? 'Like' : 'Likes'}</em>
        </button>
      </div>

      <form className="blog-comment-form" onSubmit={handleCommentSubmit}>
        <label htmlFor={`comment-${slug}`}>Comment</label>
        <textarea
          id={`comment-${slug}`}
          maxLength={600}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a short comment..."
          rows={4}
          value={draft}
        />
        <div className="blog-comment-actions">
          <span>{comments.length} comments</span>
          <button type="submit">Publish</button>
        </div>
      </form>

      {statusMessage && <p className="blog-interaction-status">{statusMessage}</p>}

      <div className="blog-comment-list" aria-live="polite">
        {comments.map((comment) => (
          <article className="blog-comment" key={comment.id}>
            <div className="blog-comment-meta">
              <strong>{comment.name}</strong>
              <span>{formatCommentDate(comment.createdAt)}</span>
            </div>
            <p>{comment.text}</p>
          </article>
        ))}
      </div>

      {isNameDialogOpen && (
        <div className="comment-name-overlay" role="presentation">
          <form className="comment-name-dialog" onSubmit={handleNameSubmit}>
            <h3>Your name</h3>
            <p>Choose a name or nickname before publishing your comment.</p>
            <input
              autoFocus
              maxLength={32}
              name="name"
              placeholder="Name or nickname"
              type="text"
            />
            <div className="comment-name-actions">
              <button
                onClick={() => setIsNameDialogOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button type="submit">Continue</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
