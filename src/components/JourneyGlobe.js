import { useMemo, useState } from 'react'
import Link from 'next/link'

const VIEWBOX = 640
const CENTER = VIEWBOX / 2
const RADIUS = 220
const CENTER_LAT = 16
const CENTER_LNG = 105
const DEG_TO_RAD = Math.PI / 180

const LANDMASSES = [
  {
    name: 'eurasia',
    points: [
      [68, -10],
      [71, 28],
      [68, 58],
      [72, 92],
      [65, 124],
      [57, 150],
      [46, 152],
      [39, 137],
      [35, 123],
      [29, 121],
      [23, 116],
      [20, 108],
      [12, 103],
      [5, 99],
      [7, 89],
      [18, 76],
      [8, 78],
      [13, 64],
      [24, 58],
      [30, 48],
      [38, 41],
      [42, 28],
      [48, 18],
      [54, 8],
      [58, -5],
      [68, -10],
    ],
  },
  {
    name: 'arabia',
    points: [
      [31, 36],
      [28, 48],
      [22, 55],
      [13, 52],
      [12, 43],
      [18, 38],
      [25, 35],
      [31, 36],
    ],
  },
  {
    name: 'india',
    points: [
      [24, 67],
      [28, 78],
      [22, 87],
      [12, 80],
      [9, 73],
      [16, 68],
      [24, 67],
    ],
  },
  {
    name: 'southeast-asia',
    points: [
      [23, 98],
      [21, 106],
      [16, 109],
      [10, 105],
      [6, 101],
      [3, 104],
      [7, 112],
      [13, 121],
      [18, 123],
      [22, 117],
      [18, 110],
      [23, 98],
    ],
  },
  {
    name: 'africa',
    points: [
      [36, -16],
      [33, 8],
      [24, 31],
      [12, 42],
      [-4, 41],
      [-18, 34],
      [-34, 23],
      [-35, 14],
      [-25, 4],
      [-10, -7],
      [8, -14],
      [23, -17],
      [36, -16],
    ],
  },
  {
    name: 'australia',
    points: [
      [-12, 113],
      [-18, 128],
      [-25, 147],
      [-37, 150],
      [-43, 137],
      [-36, 119],
      [-24, 112],
      [-12, 113],
    ],
  },
  {
    name: 'japan',
    points: [
      [43, 141],
      [39, 142],
      [35, 139],
      [32, 132],
      [35, 130],
      [39, 136],
      [43, 141],
    ],
  },
  {
    name: 'taiwan',
    points: [
      [25.5, 121],
      [23.5, 122],
      [21.8, 121],
      [23.4, 120],
      [25.5, 121],
    ],
  },
  {
    name: 'indonesia',
    points: [
      [4, 96],
      [1, 106],
      [-5, 116],
      [-8, 128],
      [-4, 137],
      [1, 125],
      [3, 111],
      [4, 96],
    ],
  },
]

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

function projectedPolygon(points) {
  const projected = points.map(([lat, lng]) => projectPoint(lat, lng))
  const visible = projected.filter((point) => point.visible)

  if (visible.length < 3) {
    return null
  }

  return `${linePath(visible)} Z`
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

function buildLandPaths() {
  return LANDMASSES.map((land) => ({
    name: land.name,
    path: projectedPolygon(land.points),
  })).filter((land) => land.path)
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

function getCardPlacement(marker) {
  if (marker.x < CENTER - 72) {
    return {
      side: 'right',
      style: {
        left: `${(marker.x / VIEWBOX) * 100}%`,
        top: `${(marker.y / VIEWBOX) * 100}%`,
        '--card-x': '20px',
        '--card-y': '-50%',
      },
    }
  }

  if (marker.x > CENTER + 72) {
    return {
      side: 'left',
      style: {
        left: `${(marker.x / VIEWBOX) * 100}%`,
        top: `${(marker.y / VIEWBOX) * 100}%`,
        '--card-x': 'calc(-100% - 20px)',
        '--card-y': '-50%',
      },
    }
  }

  return {
    side: marker.y < CENTER ? 'bottom' : 'top',
    style: {
      left: `${(marker.x / VIEWBOX) * 100}%`,
      top: `${(marker.y / VIEWBOX) * 100}%`,
      '--card-x': '-50%',
      '--card-y': marker.y < CENTER ? '20px' : 'calc(-100% - 20px)',
    },
  }
}

export default function JourneyGlobe({ posts }) {
  const [activeSlug, setActiveSlug] = useState(null)
  const { latitudeLines, longitudeLines } = useMemo(buildGlobeLines, [])
  const landPaths = useMemo(buildLandPaths, [])

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
  const activeCard = activeMarker ? getCardPlacement(activeMarker) : null

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
        <div
          className={`journey-globe-sphere${
            activeMarker ? ' is-previewing' : ''
          }`}
          aria-hidden="true"
        >
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
              {landPaths.map((land) => (
                <path
                  className={`journey-globe-land journey-globe-land--${land.name}`}
                  d={land.path}
                  key={land.name}
                />
              ))}
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
            onBlur={() => setActiveSlug(null)}
            onFocus={() => setActiveSlug(marker.post.slug)}
            onMouseEnter={() => setActiveSlug(marker.post.slug)}
            onMouseLeave={() => setActiveSlug(null)}
            prefetch={false}
            style={{
              left: `${(marker.x / VIEWBOX) * 100}%`,
              top: `${(marker.y / VIEWBOX) * 100}%`,
              '--marker-scale': marker.scale,
            }}
          >
            <span>{formatPlace(marker.post.globe)}</span>
          </Link>
        ))}

        {activeMarker && activeCard && (
          <Link
            className={`journey-globe-card journey-globe-card--${activeCard.side}`}
            href={`/blog/${activeMarker.post.slug}`}
            prefetch={false}
            style={activeCard.style}
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
