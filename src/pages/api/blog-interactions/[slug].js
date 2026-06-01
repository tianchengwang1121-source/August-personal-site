const MAX_COMMENT_LENGTH = 600
const MAX_NAME_LENGTH = 32
const MAX_STORED_COMMENTS = 200

const memoryStore = globalThis.__blogInteractionStore || {
  comments: new Map(),
  likes: new Map(),
}

globalThis.__blogInteractionStore = memoryStore

function getRedisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.BLOG_REDIS_REST_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.BLOG_REDIS_REST_TOKEN

  if (!url || !token) {
    return null
  }

  return { token, url }
}

function isValidSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug)
}

function cleanText(value, limit) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit)
}

function getKeys(slug) {
  return {
    comments: `blog:${slug}:comments`,
    likes: `blog:${slug}:likes`,
  }
}

async function redisCommand(command) {
  const config = getRedisConfig()

  if (!config) {
    return null
  }

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new Error('Redis request failed')
  }

  const result = await response.json()
  return result.result
}

function sortComments(comments) {
  return comments.sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
  )
}

async function getState(slug) {
  const keys = getKeys(slug)

  if (getRedisConfig()) {
    const [likes, rawComments] = await Promise.all([
      redisCommand(['GET', keys.likes]),
      redisCommand(['LRANGE', keys.comments, 0, MAX_STORED_COMMENTS - 1]),
    ])

    return {
      comments: (rawComments || [])
        .map((item) => {
          try {
            return JSON.parse(item)
          } catch {
            return null
          }
        })
        .filter(Boolean),
      likes: Number(likes || 0),
    }
  }

  return {
    comments: memoryStore.comments.get(slug) || [],
    likes: memoryStore.likes.get(slug) || 0,
  }
}

async function setLike(slug, delta) {
  const keys = getKeys(slug)

  if (getRedisConfig()) {
    const nextValue = await redisCommand(['INCRBY', keys.likes, delta])

    if (Number(nextValue) < 0) {
      await redisCommand(['SET', keys.likes, 0])
      return 0
    }

    return Number(nextValue)
  }

  const nextValue = Math.max(0, (memoryStore.likes.get(slug) || 0) + delta)
  memoryStore.likes.set(slug, nextValue)
  return nextValue
}

async function addComment(slug, comment) {
  const keys = getKeys(slug)

  if (getRedisConfig()) {
    await redisCommand(['LPUSH', keys.comments, JSON.stringify(comment)])
    await redisCommand(['LTRIM', keys.comments, 0, MAX_STORED_COMMENTS - 1])
    return getState(slug)
  }

  const comments = sortComments([
    comment,
    ...(memoryStore.comments.get(slug) || []),
  ]).slice(0, MAX_STORED_COMMENTS)

  memoryStore.comments.set(slug, comments)

  return {
    comments,
    likes: memoryStore.likes.get(slug) || 0,
  }
}

export default async function handler(request, response) {
  const { slug } = request.query

  if (!isValidSlug(slug)) {
    response.status(400).json({ message: 'Invalid slug' })
    return
  }

  try {
    if (request.method === 'GET') {
      response.status(200).json(await getState(slug))
      return
    }

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'GET, POST')
      response.status(405).json({ message: 'Method not allowed' })
      return
    }

    const { action } = request.body || {}

    if (action === 'like' || action === 'unlike') {
      const likes = await setLike(slug, action === 'like' ? 1 : -1)
      const state = await getState(slug)

      response.status(200).json({
        comments: state.comments,
        likes,
      })
      return
    }

    if (action === 'comment') {
      const name = cleanText(request.body.name, MAX_NAME_LENGTH)
      const text = cleanText(request.body.text, MAX_COMMENT_LENGTH)

      if (!name || !text) {
        response.status(400).json({ message: 'Name and comment are required' })
        return
      }

      const comment = {
        createdAt: new Date().toISOString(),
        id: crypto.randomUUID(),
        name,
        text,
      }

      response.status(201).json(await addComment(slug, comment))
      return
    }

    response.status(400).json({ message: 'Unknown action' })
  } catch {
    response.status(500).json({ message: 'Interaction service unavailable' })
  }
}
