import { useEffect, useState } from 'react'
import Script from 'next/script'

const launchDate = new Date('2026-05-31T00:00:00+08:00')
const localHosts = new Set(['localhost', '127.0.0.1', '::1'])

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

export default function SiteStats({ staticStats }) {
  const [onlineTime, setOnlineTime] = useState(() => formatOnlineTime(new Date()))
  const [shouldLoadCounter, setShouldLoadCounter] = useState(null)

  useEffect(() => {
    setShouldLoadCounter(!localHosts.has(window.location.hostname))

    const timer = window.setInterval(() => {
      setOnlineTime(formatOnlineTime(new Date()))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      {shouldLoadCounter && (
        <Script
          src="https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js"
          strategy="afterInteractive"
        />
      )}
      <div className="footer-stats" aria-label="Site statistics">
        {staticStats.map((item) => (
          <div className="footer-stat" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
        <div className="footer-stat footer-stat-live">
          <strong id="busuanzi_site_uv" suppressHydrationWarning>
            {shouldLoadCounter === false ? '--' : '...'}
          </strong>
          <span>Visitors</span>
        </div>
        <div className="footer-stat footer-stat-live">
          <strong id="busuanzi_site_pv" suppressHydrationWarning>
            {shouldLoadCounter === false ? '--' : '...'}
          </strong>
          <span>Page Views</span>
        </div>
        <div className="footer-stat footer-stat-wide">
          <strong>{onlineTime}</strong>
          <span>Online</span>
        </div>
      </div>
    </>
  )
}
