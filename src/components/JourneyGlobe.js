import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { geoEquirectangular, geoGraticule, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import chinaProvinces from '../data/china-provinces.json'
import worldAtlas from 'world-atlas/countries-10m.json'

const VIEWBOX_WIDTH = 960
const VIEWBOX_HEIGHT = 480
const MAP_PADDING = 0
const MAP_X = MAP_PADDING
const MAP_Y = MAP_PADDING
const MAP_WIDTH = VIEWBOX_WIDTH - MAP_PADDING * 2
const MAP_HEIGHT = VIEWBOX_HEIGHT - MAP_PADDING * 2
const MAP_CENTER_LONGITUDE = 150
const MIN_ZOOM = 1
const MAX_ZOOM = 5.4
const WHEEL_SENSITIVITY = 0.0026
const PINCH_WHEEL_SENSITIVITY = 0.004
const MAX_WHEEL_DELTA = 92
const WHEEL_ZOOM_SESSION_MS = 420
const ZOOM_SYNC_DELAY = 180
const REDRAW_IDLE_DELAY = 160
const DEFAULT_ZOOM = { scale: 1, x: 0, y: 0 }

const mapFrame = [
  [MAP_PADDING, MAP_PADDING],
  [VIEWBOX_WIDTH - MAP_PADDING, VIEWBOX_HEIGHT - MAP_PADDING],
]

const mapProjection = geoEquirectangular()
  .rotate([-MAP_CENTER_LONGITUDE, 0])
  .fitExtent(mapFrame, { type: 'Sphere' })
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

function getViewboxPoint(clientX, clientY, rect) {
  return {
    x: ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
    y: ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
  }
}

function getPointerDistance(first, second) {
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY)
}

function getWheelDelta(event) {
  const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1

  return {
    x: event.deltaX * deltaMultiplier,
    y: event.deltaY * deltaMultiplier,
  }
}

function getWheelZoomMode(event, delta, isMouseWheelSessionActive = false) {
  const absX = Math.abs(delta.x)
  const wheelDelta = Math.abs(event.wheelDelta || event.webkitWheelDelta || 0)
  const absDeltaY = Math.abs(event.deltaY)

  if (absX > 0) {
    return null
  }

  if (event.ctrlKey) {
    return 'pinch'
  }

  if (isMouseWheelSessionActive && absDeltaY > 0) {
    return 'mouse'
  }

  if (event.deltaMode !== 0) {
    return 'mouse'
  }

  if (wheelDelta) {
    return Number.isInteger(event.deltaY) && absDeltaY > 0 ? 'mouse' : null
  }

  return Number.isInteger(event.deltaY) && absDeltaY > 0 ? 'mouse' : null
}

function getPinchMetrics(pointers, rect) {
  const [first, second] = Array.from(pointers.values())

  if (!first || !second) {
    return null
  }

  return {
    distance: getPointerDistance(first, second),
    focus: getViewboxPoint(
      (first.clientX + second.clientX) / 2,
      (first.clientY + second.clientY) / 2,
      rect
    ),
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
        '--card-origin': '100% 50%',
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
        '--card-origin': '0% 50%',
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
      '--card-origin': marker.y < VIEWBOX_HEIGHT * 0.5 ? '50% 0%' : '50% 100%',
    },
  }
}

export default function JourneyGlobe({ posts }) {
  const router = useRouter()
  const [activeKey, setActiveKey] = useState(null)
  const [, setZoom] = useState(DEFAULT_ZOOM)
  const [isDragging, setIsDragging] = useState(false)
  const applyZoomToDomRef = useRef(null)
  const chinaProvincesRef = useRef(null)
  const mapContentRef = useRef(null)
  const stageShellRef = useRef(null)
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const hideTimerRef = useRef(null)
  const markerPointerTypeRef = useRef(null)
  const markerByKeyRef = useRef(new Map())
  const markerSymbolRefs = useRef(new Map())
  const pinchRef = useRef(null)
  const pointerRefs = useRef(new Map())
  const pageScrollLockRef = useRef(null)
  const handleMapWheelRef = useRef(null)
  const redrawTimerRef = useRef(null)
  const resetPointerGestureRef = useRef(null)
  const syncTimerRef = useRef(null)
  const shellScrollDragRef = useRef(null)
  const setZoomSmoothRef = useRef(null)
  const visualZoomRef = useRef(DEFAULT_ZOOM)
  const wheelZoomSessionUntilRef = useRef(0)
  const zoomRef = useRef(DEFAULT_ZOOM)
  const zoomFrameRef = useRef(null)
  const shouldRenderAfterFrameRef = useRef(false)
  const shouldSyncAfterFrameRef = useRef(false)

  const mapPaths = useMemo(
    () => ({
      chinaProvinces: mapPath(chinaProvinces),
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
  markerByKeyRef.current = new Map(markers.map((marker) => [marker.key, marker]))

  const activeSourceMarker = activeKey ? markerByKeyRef.current.get(activeKey) : null
  const activeMarker = activeSourceMarker
    ? transformPoint(activeSourceMarker, zoomRef.current)
    : null
  const activeCard = activeMarker ? getCardPlacement(activeMarker) : null
  const placeCountLabel = `${markers.length} ${markers.length === 1 ? 'PLACE' : 'PLACES'}`

  function positionMarkerNodes(nextZoom) {
    markerSymbolRefs.current.forEach((node, key) => {
      const marker = markerByKeyRef.current.get(key)

      if (!marker) {
        return
      }

      const visibleMarker = transformPoint(marker, nextZoom)

      node.setAttribute(
        'transform',
        `translate(${marker.x} ${marker.y}) scale(${1 / nextZoom.scale})`
      )
      node.style.opacity = visibleMarker.visible ? '1' : '0'
      node.style.pointerEvents = visibleMarker.visible ? 'auto' : 'none'
    })
  }

  function applyZoomToDom(nextZoom) {
    const transform = `translate(${nextZoom.x} ${nextZoom.y}) scale(${nextZoom.scale})`

    if (mapContentRef.current) {
      mapContentRef.current.setAttribute('transform', transform)
    }

    if (chinaProvincesRef.current) {
      chinaProvincesRef.current.style.opacity =
        nextZoom.scale >= 1.45 ? '0.68' : '0'
    }

    positionMarkerNodes(nextZoom)
  }
  applyZoomToDomRef.current = applyZoomToDom

  function syncZoomStateSoon() {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
    }

    syncTimerRef.current = setTimeout(() => {
      syncTimerRef.current = null
      setZoom(zoomRef.current)
    }, ZOOM_SYNC_DELAY)
  }

  function cancelZoomFrame() {
    if (zoomFrameRef.current) {
      cancelAnimationFrame(zoomFrameRef.current)
      zoomFrameRef.current = null
    }

    shouldRenderAfterFrameRef.current = false
  }

  function clearRedrawTimer() {
    if (redrawTimerRef.current) {
      clearTimeout(redrawTimerRef.current)
      redrawTimerRef.current = null
    }
  }

  function lockPageScrollForWheel(duration = WHEEL_ZOOM_SESSION_MS) {
    if (typeof window === 'undefined') {
      return
    }

    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const lockUntil = performance.now() + duration

    if (pageScrollLockRef.current) {
      cancelAnimationFrame(pageScrollLockRef.current)
    }

    function restoreScrollPosition() {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
        window.scrollTo(scrollX, scrollY)
      }

      if (performance.now() < lockUntil) {
        pageScrollLockRef.current = requestAnimationFrame(restoreScrollPosition)
        return
      }

      pageScrollLockRef.current = null
    }

    pageScrollLockRef.current = requestAnimationFrame(restoreScrollPosition)
  }

  function scheduleCrispRedraw() {
    clearRedrawTimer()
    redrawTimerRef.current = setTimeout(() => {
      redrawTimerRef.current = null
      applyZoomToDomRef.current?.(zoomRef.current, { render: true })
    }, REDRAW_IDLE_DELAY)
  }

  function scheduleZoomFrame(options = {}) {
    if (options.sync !== false) {
      shouldSyncAfterFrameRef.current = true
    }

    if (options.render) {
      shouldRenderAfterFrameRef.current = true
    }

    if (zoomFrameRef.current) {
      return
    }

    zoomFrameRef.current = requestAnimationFrame(() => {
      zoomFrameRef.current = null
      visualZoomRef.current = zoomRef.current
      const shouldRender = shouldRenderAfterFrameRef.current

      shouldRenderAfterFrameRef.current = false
      applyZoomToDomRef.current?.(visualZoomRef.current, {
        render: shouldRender,
      })

      if (!shouldRender) {
        scheduleCrispRedraw()
      }

      if (shouldSyncAfterFrameRef.current) {
        shouldSyncAfterFrameRef.current = false
        syncZoomStateSoon()
      }
    })
  }

  function applyZoomImmediately(nextZoom, options = {}) {
    cancelZoomFrame()
    zoomRef.current = nextZoom
    visualZoomRef.current = nextZoom
    applyZoomToDomRef.current?.(nextZoom, { render: true })

    if (options.sync !== false) {
      syncZoomStateSoon()
    }
  }

  function flushZoomState() {
    cancelZoomFrame()
    visualZoomRef.current = zoomRef.current
    clearRedrawTimer()
    applyZoomToDomRef.current?.(zoomRef.current, { render: true })

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current)
      syncTimerRef.current = null
    }

    setZoom(zoomRef.current)
  }

  function prepareZoomGesture() {
    cancelZoomFrame()
    visualZoomRef.current = zoomRef.current
    clearRedrawTimer()
    applyZoomToDomRef.current?.(zoomRef.current)
  }

  function setZoomSmooth(nextZoom, options = {}) {
    zoomRef.current = nextZoom

    if (options.immediate) {
      applyZoomImmediately(nextZoom, options)
      return
    }

    scheduleZoomFrame(options)
  }
  setZoomSmoothRef.current = setZoomSmooth

  useEffect(
    () => () => {
      cancelZoomFrame()
      clearRedrawTimer()

      if (pageScrollLockRef.current) {
        cancelAnimationFrame(pageScrollLockRef.current)
      }

      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
    },
    []
  )

  useEffect(() => {
    applyZoomToDomRef.current?.(zoomRef.current, { render: true })
  }, [markers])

  useEffect(() => {
    const shell = stageShellRef.current

    if (!shell) {
      return undefined
    }

    function syncMobileScrollPosition() {
      const isMobile = window.matchMedia('(max-width: 720px)').matches

      if (!isMobile) {
        shell.scrollLeft = 0
        shell.dataset.journeyMapMobileScroll = ''
        return
      }

      if (!shell.dataset.journeyMapMobileScroll) {
        shell.scrollLeft = Math.max(0, (shell.scrollWidth - shell.clientWidth) * 0.56)
        shell.dataset.journeyMapMobileScroll = 'set'
      }
    }

    syncMobileScrollPosition()
    window.addEventListener('resize', syncMobileScrollPosition)

    return () => {
      window.removeEventListener('resize', syncMobileScrollPosition)
    }
  }, [])

  function resetPointerGesture() {
    const hadGesture =
      dragRef.current || pinchRef.current || pointerRefs.current.size > 0

    dragRef.current = null
    pinchRef.current = null
    shellScrollDragRef.current = null
    pointerRefs.current.clear()

    if (hadGesture) {
      setIsDragging(false)
    }
  }
  resetPointerGestureRef.current = resetPointerGesture

  function handleMapWheel(event) {
    if (event.__journeyMapWheelHandled) {
      return
    }

    const stage = stageRef.current

    if (!stage) {
      return
    }

    const rect = stage.getBoundingClientRect()
    const isInsideStage =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom

    if (!isInsideStage) {
      return
    }

    const delta = getWheelDelta(event)
    const wheelZoomMode = getWheelZoomMode(
      event,
      delta,
      performance.now() < wheelZoomSessionUntilRef.current
    )

    if (!wheelZoomMode) {
      return
    }

    event.__journeyMapWheelHandled = true
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation?.()
    lockPageScrollForWheel()

    if (wheelZoomMode === 'mouse') {
      wheelZoomSessionUntilRef.current = performance.now() + WHEEL_ZOOM_SESSION_MS
    }

    resetPointerGestureRef.current?.()

    const focusX = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH
    const focusY = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT
    const deltaY = clamp(
      delta.y,
      -MAX_WHEEL_DELTA,
      MAX_WHEEL_DELTA
    )
    const sensitivity = event.ctrlKey ? PINCH_WHEEL_SENSITIVITY : WHEEL_SENSITIVITY
    const current = zoomRef.current
    const nextScale = clamp(
      current.scale * Math.exp(-deltaY * sensitivity),
      MIN_ZOOM,
      MAX_ZOOM
    )
    const ratio = nextScale / current.scale

    setZoomSmoothRef.current(
      clampZoomTransform({
        scale: nextScale,
        x: focusX - (focusX - current.x) * ratio,
        y: focusY - (focusY - current.y) * ratio,
      })
    )
  }
  handleMapWheelRef.current = handleMapWheel

  function handleReactWheelCapture(event) {
    handleMapWheel(event.nativeEvent || event)
  }

  useEffect(() => {
    const stage = stageRef.current

    if (!stage) {
      return undefined
    }

    function handleStageWheel(event) {
      handleMapWheelRef.current?.(event)
    }

    stage.addEventListener('wheel', handleStageWheel, {
      capture: true,
      passive: false,
    })

    return () => {
      stage.removeEventListener('wheel', handleStageWheel, true)
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

    if (activeKey === key) {
      return
    }

    setZoom(zoomRef.current)
    setActiveKey(key)
  }

  function openMarkerPost(event, marker) {
    event.preventDefault()

    const isTouchMarker =
      markerPointerTypeRef.current === 'touch' ||
      (typeof window !== 'undefined' &&
        window.matchMedia?.('(hover: none), (pointer: coarse)').matches)

    if (isTouchMarker) {
      showPreview(marker.key)
      return
    }

    router.push(`/blog/${marker.posts[0].slug}`)
  }

  function handleMarkerKeyDown(event, marker) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    openMarkerPost(event, marker)
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
      event.currentTarget?.hasPointerCapture?.(event.pointerId) &&
      event.currentTarget?.releasePointerCapture
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null
    pinchRef.current = null
    shellScrollDragRef.current = null
    pointerRefs.current.clear()
    setIsDragging(false)
  }

  function startPinch(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const pinch = getPinchMetrics(pointerRefs.current, rect)

    if (!pinch || pinch.distance < 8) {
      return false
    }

    pinchRef.current = {
      focus: pinch.focus,
      lastDistance: pinch.distance,
      lastFocus: pinch.focus,
    }
    dragRef.current = null
    shellScrollDragRef.current = null
    setIsDragging(false)

    return true
  }

  function handlePointerDown(event) {
    if (
      event.button !== 0 ||
      event.target.closest?.(
        '.journey-map-marker-link, .journey-globe-marker, .journey-globe-card'
      )
    ) {
      return
    }

    event.preventDefault()
    clearHideTimer()
    setActiveKey(null)
    prepareZoomGesture()
    pointerRefs.current.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    })
    event.currentTarget.setPointerCapture?.(event.pointerId)

    if (pointerRefs.current.size >= 2 && startPinch(event)) {
      event.preventDefault()
      return
    }

    if (event.pointerType === 'touch' && zoomRef.current.scale <= MIN_ZOOM) {
      shellScrollDragRef.current = {
        pointerId: event.pointerId,
        startClientX: event.clientX,
        startScrollLeft: stageShellRef.current?.scrollLeft || 0,
      }
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()

    dragRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      rectHeight: rect.height,
      rectWidth: rect.width,
      zoom: zoomRef.current,
    }

    setIsDragging(true)
  }

  function handlePointerMove(event) {
    if (pointerRefs.current.has(event.pointerId)) {
      pointerRefs.current.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY,
      })
    }

    if (pointerRefs.current.size >= 2) {
      event.preventDefault()

      if (!pinchRef.current && !startPinch(event)) {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const pinch = getPinchMetrics(pointerRefs.current, rect)

      if (!pinch || pinch.distance < 8) {
        return
      }

      const current = zoomRef.current
      const lastDistance = pinchRef.current.lastDistance || pinch.distance
      const nextScale = clamp(
        current.scale * (pinch.distance / lastDistance),
        MIN_ZOOM,
        MAX_ZOOM
      )
      const ratio = nextScale / current.scale
      const focus = pinch.focus

      setZoomSmooth(
        clampZoomTransform({
          scale: nextScale,
          x: focus.x - (focus.x - current.x) * ratio,
          y: focus.y - (focus.y - current.y) * ratio,
        }),
        { sync: false }
      )

      pinchRef.current.lastDistance = pinch.distance
      pinchRef.current.lastFocus = pinch.focus

      return
    }

    const shellScrollDrag = shellScrollDragRef.current

    if (
      shellScrollDrag &&
      event.pointerType === 'touch' &&
      shellScrollDrag.pointerId === event.pointerId
    ) {
      const shell = stageShellRef.current

      if (shell) {
        event.preventDefault()
        shell.scrollLeft =
          shellScrollDrag.startScrollLeft -
          (event.clientX - shellScrollDrag.startClientX)
      }

      return
    }

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
      }),
      { render: true, sync: false }
    )
  }

  function handlePointerEnd(event) {
    if (
      event.currentTarget?.hasPointerCapture?.(event.pointerId) &&
      event.currentTarget?.releasePointerCapture
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    pointerRefs.current.delete(event.pointerId)

    if (pointerRefs.current.size < 2) {
      pinchRef.current = null
    }

    shellScrollDragRef.current = null
    dragRef.current = null
    setIsDragging(false)
    flushZoomState()
  }

  function handleStageLeave() {
    hidePreview()
    stopDragging()
  }

  return (
    <section className="journey-globe" aria-label="Journey map">
      <div className="journey-globe-heading">
        <span>JOURNEY MAP</span>
        <span>{placeCountLabel}</span>
      </div>

      <div
        className="journey-globe-stage-shell"
        ref={stageShellRef}
      >
        <div
          className={`journey-globe-stage${isDragging ? ' is-dragging' : ''}`}
          onMouseLeave={handleStageLeave}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onWheelCapture={handleReactWheelCapture}
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
                <linearGradient id="journeyMapLand" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8f9fa" />
                  <stop offset="100%" stopColor="#f1f2f4" />
                </linearGradient>
                <pattern
                  id="journeyMapDots"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="0.8" fill="rgba(17,17,19,0.045)" />
                </pattern>
                <clipPath id="journeyMapClip">
                  <rect
                    height={MAP_HEIGHT}
                    width={MAP_WIDTH}
                    x={MAP_X}
                    y={MAP_Y}
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#journeyMapClip)">
                <rect
                  className="journey-map-dotfield"
                  height={MAP_HEIGHT}
                  width={MAP_WIDTH}
                  x={MAP_X}
                  y={MAP_Y}
                />
                <g className="journey-map-world-group" ref={mapContentRef}>
                  <path className="journey-map-graticule" d={mapPaths.graticule} />
                  <path className="journey-map-land" d={mapPaths.land} />
                  <path className="journey-map-coastline" d={mapPaths.coastline} />
                  <path className="journey-map-borders" d={mapPaths.borders} />
                  <path
                    className="journey-map-china-provinces"
                    d={mapPaths.chinaProvinces}
                    ref={chinaProvincesRef}
                  />
                  <g className="journey-map-marker-layer">
                    {markers.map((marker) => (
                      <g
                        aria-label={formatPlace(marker.globe)}
                        className={`journey-map-marker-link${
                          marker.key === activeKey ? ' is-active' : ''
                        }`}
                        key={marker.key}
                        onBlur={scheduleHidePreview}
                        onClick={(event) => openMarkerPost(event, marker)}
                        onFocus={() => showPreview(marker.key)}
                        onKeyDown={(event) => handleMarkerKeyDown(event, marker)}
                        onMouseEnter={() => showPreview(marker.key)}
                        onMouseLeave={scheduleHidePreview}
                        onMouseMove={() => showPreview(marker.key)}
                        onPointerDown={(event) => {
                          markerPointerTypeRef.current = event.pointerType
                        }}
                        onPointerEnter={() => showPreview(marker.key)}
                        ref={(node) => {
                          if (node) {
                            markerSymbolRefs.current.set(marker.key, node)
                          } else {
                            markerSymbolRefs.current.delete(marker.key)
                          }
                        }}
                        role="link"
                        tabIndex={0}
                        transform={`translate(${marker.x} ${marker.y})`}
                      >
                        <circle className="journey-map-marker-hit" r="17" />
                        <circle className="journey-map-marker-halo" r="11.5" />
                        <circle className="journey-map-marker-ring" r="9" />
                        <circle className="journey-map-marker-core" r="5.2" />
                      </g>
                    ))}
                  </g>
                </g>
              </g>
            </svg>

            {activeMarker && activeCard && (
              <div
                className={`journey-globe-card journey-globe-card--${activeCard.side}${
                  activeMarker.posts.length > 1 ? ' journey-globe-card--stacked' : ''
                }`}
                onBlur={scheduleHidePreview}
                onFocus={() => showPreview(activeMarker.key)}
                onMouseEnter={() => showPreview(activeMarker.key)}
                onMouseLeave={scheduleHidePreview}
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
      </div>

      <p className="journey-globe-hint">
        Scroll to zoom · drag to explore
      </p>
    </section>
  )
}
