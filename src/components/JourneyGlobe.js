import { useMemo, useState } from 'react'
import Link from 'next/link'

const VIEWBOX = 640
const CENTER = VIEWBOX / 2
const RADIUS = 220
const CENTER_LAT = 16
const CENTER_LNG = 105
const DEG_TO_RAD = Math.PI / 180

function projectPoint(lat, lng) {
  const latitude = lat * DEG_TO_RAD
  const longitude = (lng - CENTER_LNG) * DEG_TO_RAD
  const centerLatitude = CENTER_LAT * DEG_TO_RAD

  const x = Math.cos(latitude) * Math.sin(longitude)
  const y =
    Math.cos(centerLatitude) * Math.sin(latitude) -
    Math.sin(centerLatitude) * Math.cos(latitude) * Math.cos(longitude)
  const z =
    Math.sin(centerLatitude) * Math.sin(latitude) +
    Math.cos(centerLatitude) * Math.cos(latitude) * Math.cos(longitude)

  return {
    x: CENTER + RADIUS * x,
    y: CENTER - RADIUS * y,
    scale: Math.max(0.58, 0.76 + z * 0.26),
    visible: z > -0.2,
  }
}

function linePath(points) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
}

function projectedLine(points) {
  const projected = points.map(([lat, lng]) => projectPoint(lat, lng))
  const visible = projected.filter((point) => point.visible)

  if (visible.length < 2) {
    return null
  }

  return linePath(visible)
}

function buildGlobeLines() {
  const latitudeLines = [-60, -30, 0, 30, 60]
    .map((lat) =>
      projectedLine(
        Array.from({ length: 49 }, (_, index) => [lat, -180 + index * 7.5])
      )
    )
    .filter(Boolean)

  const longitudeLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]
    .map((lng) =>
      projectedLine(
        Array.from({ length: 49 }, (_, index) => [-72 + index * 3, lng])
      )
    )
    .filter(Boolean)

  return { latitudeLines, longitudeLines }
}

function getMarkerOffset(post, index) {
  if (post.globe.city !== 'Hong Kong') {
    return { x: 0, y: 0 }
  }

  return index % 2 === 0 ? { x: -7, y: 5 } : { x: 8, y: -6 }
}

function formatPlace(globe) {
  if (globe.city === globe.region) {
    return globe.city
  }

  return `${globe.city}, ${globe.region}`
}

export default function JourneyGlobe({ posts }) {
  const [activeSlug, setActiveSlug] = useState(null)
  const { latitudeLines, longitudeLines } = useMemo(buildGlobeLines, [])

  const markers = useMemo(
    () =>
      posts
        .filter((post) => post.globe)
        .map((post, index) => {
          const projected = projectPoint(post.globe.lat, post.globe.lng)
          const offset = getMarkerOffset(post, index)

          return {
            post,
            x: projected.x + offset.x,
            y: projected.y + offset.y,
            scale: projected.scale,
          }
        }),
    [posts]
  )

  const activeMarker = markers.find((marker) => marker.post.slug === activeSlug)

  return (
    <section className="journey-globe" aria-label="Journey globe">
      <div className="journey-globe-heading">
        <p className="eyebrow">Journey map</p>
        <h2>Places recorded</h2>
      </div>

      <div
        className="journey-globe-stage"
        onMouseLeave={() => setActiveSlug(null)}
      >
        <div className="journey-globe-sphere" aria-hidden="true">
          <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} role="img">
            <defs>
              <radialGradient id="globeSurface" cx="42%" cy="34%" r="68%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="48%" stopColor="#f4f5f7" />
                <stop offset="100%" stopColor="#e6e8ec" />
              </radialGradient>
              <radialGradient id="globeShade" cx="36%" cy="30%" r="78%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="72%" stopColor="rgba(17,17,19,0.02)" />
                <stop offset="100%" stopColor="rgba(17,17,19,0.12)" />
              </radialGradient>
              <clipPath id="globeClip">
                <circle cx={CENTER} cy={CENTER} r={RADIUS} />
              </clipPath>
              <pattern
                id="globeDots"
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.1" fill="rgba(17,17,19,0.12)" />
              </pattern>
            </defs>

            <circle
              className="journey-globe-shadow"
              cx={CENTER}
              cy={CENTER + 14}
              r={RADIUS}
            />
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#globeSurface)" />
            <g clipPath="url(#globeClip)">
              <rect
                x={CENTER - RADIUS}
                y={CENTER - RADIUS}
                width={RADIUS * 2}
                height={RADIUS * 2}
                fill="url(#globeDots)"
                opacity="0.22"
              />
              {latitudeLines.map((path, index) => (
                <path
                  className="journey-globe-grid-line"
                  d={path}
                  key={`lat-${index}`}
                />
              ))}
              {longitudeLines.map((path, index) => (
                <path
                  className="journey-globe-grid-line journey-globe-grid-line--lng"
                  d={path}
                  key={`lng-${index}`}
                />
              ))}
              <path
                className="journey-globe-land"
                d="M246 220c36-30 90-35 132-15 29 14 50 33 82 30 28-3 40 16 24 38-19 27-58 21-86 28-40 10-58 44-99 44-45 0-75-30-96-63-16-26 9-54 43-62Z"
              />
              <path
                className="journey-globe-land journey-globe-land--south"
                d="M348 372c31-7 76-3 94 18 13 15 0 36-30 36-36 0-72-4-102-18-21-10-11-29 38-36Z"
              />
            </g>
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#globeShade)" />
            <circle className="journey-globe-rim" cx={CENTER} cy={CENTER} r={RADIUS} />
          </svg>
        </div>

        {markers.map((marker) => (
          <Link
            className={`journey-globe-marker${
              marker.post.slug === activeSlug ? ' is-active' : ''
            }`}
            href={`/blog/${marker.post.slug}`}
            key={marker.post.slug}
            onFocus={() => setActiveSlug(marker.post.slug)}
            onMouseEnter={() => setActiveSlug(marker.post.slug)}
            style={{
              left: `${(marker.x / VIEWBOX) * 100}%`,
              top: `${(marker.y / VIEWBOX) * 100}%`,
              '--marker-scale': marker.scale,
            }}
          >
            <span>{formatPlace(marker.post.globe)}</span>
          </Link>
        ))}

        {activeMarker && (
          <Link
            className="journey-globe-card"
            href={`/blog/${activeMarker.post.slug}`}
            style={{
              left: `${(activeMarker.x / VIEWBOX) * 100}%`,
              top: `${(activeMarker.y / VIEWBOX) * 100}%`,
            }}
          >
            <span>{formatPlace(activeMarker.post.globe)}</span>
            <strong>{activeMarker.post.displayLocation || activeMarker.post.location}</strong>
            <em>{activeMarker.post.date}</em>
            <p>{activeMarker.post.title}</p>
          </Link>
        )}
      </div>

      <p className="journey-globe-hint">Hover a point to preview. Click to read.</p>
    </section>
  )
}
