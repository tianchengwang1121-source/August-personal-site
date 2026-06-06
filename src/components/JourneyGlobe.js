import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { geoEquirectangular, geoGraticule, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import worldAtlas from 'world-atlas/countries-10m.json'

const VIEWBOX_WIDTH = 960
const VIEWBOX_HEIGHT = 520
const MAP_PADDING = 6
const MAP_RADIUS = 24
const MAP_X = MAP_PADDING
const MAP_Y = MAP_PADDING
const MAP_WIDTH = VIEWBOX_WIDTH - MAP_PADDING * 2
const MAP_HEIGHT = VIEWBOX_HEIGHT - MAP_PADDING * 2
const MIN_ZOOM = 1
const MAX_ZOOM = 5.4
const WHEEL_SENSITIVITY = 0.0022
const DEFAULT_ZOOM = { scale: 1, x: 0, y: 0 }

const mapFrame = [
  [MAP_PADDING, MAP_PADDING],
  [VIEWBOX_WIDTH - MAP_PADDING, VIEWBOX_HEIGHT - MAP_PADDING],
]

const mapProjection = geoEquirectangular().fitExtent(mapFrame, { type: 'Sphere' })
const mapPath = geoPath(mapProjection)
const graticule = geoGraticule().step([20, 20])
const landFeature = feature(worldAtlas, worldAtlas.objects.land)
const coastlineMesh = mesh(worldAtlas, worldAtlas.objects.land)
const countryMesh = mesh(
  worldAtlas,
  worldAtlas.objects.countries,
  (a, b) => a !== b
)

function formatPlace(globe) {
  if (globe.city === globe.region) {
    return globe.city
  }

  return `${globe.city}, ${globe.region}`
}

function getLocationKey(post) {
  return `${post.globe.lat},${post.globe.lng}`
}

function projectMarker(group) {
  const post = group.posts[0]
  const [x, y] = mapProjection([post.globe.lng, post.globe.lat])

  return {
    ...group,
    x,
    y,
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function clampZoomTransform(transform) {
  if (transform.scale <= MIN_ZOOM) {
    return DEFAULT_ZOOM
  }

  const minX = MAP_X + MAP_WIDTH - (MAP_X + MAP_WIDTH) * transform.scale
  const maxX = MAP_X - MAP_X * transform.scale
  const minY = MAP_Y + MAP_HEIGHT - (MAP_Y + MAP_HEIGHT) * transform.scale
  const maxY = MAP_Y - MAP_Y * transform.scale

  return {
    scale: transform.scale,
    x: clamp(transform.x, minX, maxX),
    y: clamp(transform.y, minY, maxY),
  }
}

function transformPoint(marker, zoom) {
  const x = marker.x * zoom.scale + zoom.x
  const y = marker.y * zoom.scale + zoom.y

  return {
    ...marker,
    x,
    y,
    visible:
      x >= MAP_X &&
      x <= MAP_X + MAP_WIDTH &&
      y >= MAP_Y &&
      y <= MAP_Y + MAP_HEIGHT,
  }
}

function getCardPlacement(marker) {
  if (marker.x > VIEWBOX_WIDTH * 0.66) {
    return {
      side: 'left',
      style: {
        left: `${(marker.x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(marker.y / VIEWBOX_HEIGHT) * 100}%`,
        '--card-x': 'calc(-100% - 18px)',
        '--card-y': '-50%',
      },
    }
  }

  if (marker.x < VIEWBOX_WIDTH * 0.34) {
    return {
      side: 'right',
      style: {
        left: `${(marker.x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(marker.y / VIEWBOX_HEIGHT) * 100}%`,
        '--card-x': '18px',
        '--card-y': '-50%',
      },
    }
  }

  return {
    side: marker.y < VIEWBOX_HEIGHT * 0.5 ? 'bottom' : 'top',
    style: {
      left: `${(marker.x / VIEWBOX_WIDTH) * 100}%`,
      top: `${(marker.y / VIEWBOX_HEIGHT) * 100}%`,
      '--card-x': '-50%',
      '--card-y':
        marker.y < VIEWBOX_HEIGHT * 0.5 ? '18px' : 'calc(-100% - 18px)',
    },
  }
}

export default function JourneyGlobe({ posts }) {
  const [activeKey, setActiveKey] = useState(null)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const hideTimerRef = useRef(null)
  const zoomRef = useRef(DEFAULT_ZOOM)
  const zoomFrameRef = useRef(null)

  const mapPaths = useMemo(
    () => ({
      graticule: mapPath(graticule()),
      land: mapPath(landFeature),
      coastline: mapPath(coastlineMesh),
      borders: mapPath(countryMesh),
    }),
    []
  )

  const markers = useMemo(
    () => {
      const grouped = posts.filter((post) => post.globe).reduce((groups, post) => {
        const key = getLocationKey(post)
        const group = groups.get(key)

        if (group) {
          group.posts.push(post)
        } else {
          groups.set(key, {
            key,
            globe: post.globe,
            posts: [post],
          })
        }

        return groups
      }, new Map())

      return Array.from(grouped.values()).map(projectMarker)
    },
    [posts]
  )

  const visibleMarkers = useMemo(
    () => markers.map((marker) => transformPoint(marker, zoom)),
    [markers, zoom]
  )

  const activeMarker = visibleMarkers.find((marker) => marker.key === activeKey)
  const activeCard = activeMarker ? getCardPlacement(activeMarker) : null
  const postCount = markers.reduce((count, marker) => count + marker.posts.length, 0)

  function setZoomSmooth(nextZoom) {
    zoomRef.current = nextZoom

    if (zoomFrameRef.current) {
      return
    }

    zoomFrameRef.current = requestAnimationFrame(() => {
      zoomFrameRef.current = null
      setZoom(zoomRef.current)
    })
  }

  useEffect(
    () => () => {
      if (zoomFrameRef.current) {
        cancelAnimationFrame(zoomFrameRef.current)
      }
    },
    []
  )

  useEffect(() => {
    const stage = stageRef.current

    if (!stage) {
      return undefined
    }

    function handleStageWheel(event) {
      const rect = stage.getBoundingClientRect()
      const isInsideStage =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (!isInsideStage) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const focusX = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH
      const focusY = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT
      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1
      const deltaY = event.deltaY * deltaMultiplier
      const current = zoomRef.current
      const nextScale = clamp(
        current.scale * Math.exp(-deltaY * WHEEL_SENSITIVITY),
        MIN_ZOOM,
        MAX_ZOOM
      )
      const ratio = nextScale / current.scale

      setZoomSmooth(
        clampZoomTransform({
          scale: nextScale,
          x: focusX - (focusX - current.x) * ratio,
          y: focusY - (focusY - current.y) * ratio,
        })
      )
    }

    document.addEventListener('wheel', handleStageWheel, {
      capture: true,
      passive: false,
    })

    return () => {
      document.removeEventListener('wheel', handleStageWheel, true)
    }
  }, [])

  function clearHideTimer() {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  function showPreview(key) {
    clearHideTimer()
    setActiveKey(key)
  }

  function hidePreview() {
    clearHideTimer()
    setActiveKey(null)
  }

  function scheduleHidePreview() {
    clearHideTimer()
    hideTimerRef.current = setTimeout(() => {
      setActiveKey(null)
      hideTimerRef.current = null
    }, 90)
  }

  function stopDragging(event) {
    if (
      dragRef.current &&
      typeof event?.pointerId === 'number' &&
      event.currentTarget?.releasePointerCapture
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null
    setIsDragging(false)
  }

  function handlePointerDown(event) {
    if (
      event.button !== 0 ||
      event.target.closest?.('.journey-globe-marker, .journey-globe-card')
    ) {
      return
    }

    event.preventDefault()
    clearHideTimer()
    setActiveKey(null)

    const rect = event.currentTarget.getBoundingClientRect()

    dragRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      rectHeight: rect.height,
      rectWidth: rect.width,
      zoom: zoomRef.current,
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
    setIsDragging(true)
  }

  function handlePointerMove(event) {
    const drag = dragRef.current

    if (!drag) {
      return
    }

    event.preventDefault()

    const deltaX =
      ((event.clientX - drag.startClientX) / drag.rectWidth) * VIEWBOX_WIDTH
    const deltaY =
      ((event.clientY - drag.startClientY) / drag.rectHeight) * VIEWBOX_HEIGHT

    setZoomSmooth(
      clampZoomTransform({
        scale: drag.zoom.scale,
        x: drag.zoom.x + deltaX,
        y: drag.zoom.y + deltaY,
      })
    )
  }

  function handleStageLeave() {
    hidePreview()
    stopDragging()
  }

  return (
    <section className="journey-globe" aria-label="Journey map">
      <div className="journey-globe-heading">
        <p className="eyebrow">Journey map</p>
        <h2>Places recorded</h2>
      </div>

      <div
        className={`journey-globe-stage${isDragging ? ' is-dragging' : ''}`}
        onMouseLeave={handleStageLeave}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        ref={stageRef}
      >
        <div
          className={`journey-map-drift${activeMarker ? ' is-previewing' : ''}`}
        >
          <svg
            aria-hidden="true"
            className="journey-map-canvas"
            role="img"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          >
            <defs>
              <linearGradient id="journeyMapSurface" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="68%" stopColor="#f7f8fa" />
                <stop offset="100%" stopColor="#eef0f3" />
              </linearGradient>
              <linearGradient id="journeyMapLand" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbfbfc" />
                <stop offset="100%" stopColor="#f0f1f3" />
              </linearGradient>
              <pattern
                id="journeyMapDots"
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="rgba(17,17,19,0.075)" />
              </pattern>
              <filter id="journeyMapLift" x="-12%" y="-12%" width="124%" height="124%">
                <feDropShadow
                  dx="0"
                  dy="12"
                  floodColor="rgba(17,17,19,0.16)"
                  stdDeviation="10"
                />
              </filter>
              <clipPath id="journeyMapClip">
                <rect
                  height={MAP_HEIGHT}
                  rx={MAP_RADIUS}
                  width={MAP_WIDTH}
                  x={MAP_X}
                  y={MAP_Y}
                />
              </clipPath>
            </defs>
            <rect
              className="journey-map-surface"
              height={MAP_HEIGHT}
              rx={MAP_RADIUS}
              width={MAP_WIDTH}
              x={MAP_X}
              y={MAP_Y}
            />
            <g clipPath="url(#journeyMapClip)">
              <rect
                className="journey-map-dotfield"
                height={MAP_HEIGHT}
                width={MAP_WIDTH}
                x={MAP_X}
                y={MAP_Y}
              />
              <g
                className="journey-map-zoom-layer"
                transform={`translate(${zoom.x} ${zoom.y}) scale(${zoom.scale})`}
              >
                <path className="journey-map-graticule" d={mapPaths.graticule} />
                <path className="journey-map-land" d={mapPaths.land} />
                <path className="journey-map-coastline" d={mapPaths.coastline} />
                <path className="journey-map-borders" d={mapPaths.borders} />
              </g>
            </g>
            <rect
              className="journey-map-outline"
              height={MAP_HEIGHT}
              rx={MAP_RADIUS}
              width={MAP_WIDTH}
              x={MAP_X}
              y={MAP_Y}
            />
          </svg>

          {visibleMarkers.map((marker) => (
            <Link
              className={`journey-globe-marker${
                marker.key === activeKey ? ' is-active' : ''
              }`}
              href={`/blog/${marker.posts[0].slug}`}
              key={marker.key}
              onBlur={scheduleHidePreview}
              onFocus={() => showPreview(marker.key)}
              onMouseEnter={() => showPreview(marker.key)}
              onMouseLeave={scheduleHidePreview}
              prefetch={false}
              style={{
                left: `${(marker.x / VIEWBOX_WIDTH) * 100}%`,
                top: `${(marker.y / VIEWBOX_HEIGHT) * 100}%`,
                '--marker-scale': 1,
                '--marker-opacity': marker.visible ? 1 : 0,
                pointerEvents: marker.visible ? 'auto' : 'none',
              }}
            >
              <span>{formatPlace(marker.globe)}</span>
            </Link>
          ))}

          {activeMarker && activeCard && (
            <div
              className={`journey-globe-card journey-globe-card--${activeCard.side}${
                activeMarker.posts.length > 1 ? ' journey-globe-card--stacked' : ''
              }`}
              onBlur={scheduleHidePreview}
              onFocus={() => showPreview(activeMarker.key)}
              onMouseEnter={() => showPreview(activeMarker.key)}
              onMouseLeave={hidePreview}
              style={activeCard.style}
            >
              <span>{formatPlace(activeMarker.globe)}</span>
              <div className="journey-globe-card-list">
                {activeMarker.posts.map((post) => (
                  <Link
                    className="journey-globe-card-item"
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                    prefetch={false}
                  >
                    <strong>{post.displayLocation || post.location}</strong>
                    <em>{post.date}</em>
                    <p>{post.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="journey-globe-hint">
        {postCount} posts across {markers.length} places. Scroll to zoom.
      </p>
    </section>
  )
}
