import { useEffect, useState } from 'react'

const launchDate = new Date('2026-05-31T00:00:00+08:00')
const localHosts = new Set(['localhost', '127.0.0.1', '::1'])
const counterEndpoint = 'https://bsz.saop.cc/api'

function formatOnlineTime(now) {
  const totalSeconds = Math.max(0, Math.floor((now - launchDate) / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${days}d ${String(hours).padStart(2, '0')}h ${String(
    minutes
  ).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

function formatStatNumber(value) {
  return typeof value === 'number' ? value.toLocaleString('en-US') : '--'
}

export default function SiteStats({ staticStats }) {
  const [onlineTime, setOnlineTime] = useState('--')
  const [counterStats, setCounterStats] = useState({
    pageViews: '...',
    visitors: '...',
  })

  useEffect(() => {
    const isLocalHost = localHosts.has(window.location.hostname)

    if (isLocalHost) {
      setCounterStats({
        pageViews: '--',
        visitors: '--',
      })
    } else {
      fetch(counterEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-bsz-referer': window.location.href,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Counter request failed')
          }

          return response.json()
        })
        .then((result) => {
          setCounterStats({
            pageViews: formatStatNumber(result?.data?.site_pv),
            visitors: formatStatNumber(result?.data?.site_uv),
          })
        })
        .catch(() => {
          setCounterStats({
            pageViews: '--',
            visitors: '--',
          })
        })
    }

    setOnlineTime(formatOnlineTime(new Date()))

    const timer = window.setInterval(() => {
      setOnlineTime(formatOnlineTime(new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="footer-stats" aria-label="Site statistics">
      {staticStats.map((item) => (
        <div className="footer-stat" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
      <div className="footer-stat footer-stat-live">
        <strong suppressHydrationWarning>{counterStats.visitors}</strong>
        <span>Visitors</span>
      </div>
      <div className="footer-stat footer-stat-live">
        <strong suppressHydrationWarning>{counterStats.pageViews}</strong>
        <span>Page Views</span>
      </div>
      <div className="footer-stat footer-stat-online">
        <strong suppressHydrationWarning>{onlineTime}</strong>
        <span>Online</span>
      </div>
    </div>
  )
}
