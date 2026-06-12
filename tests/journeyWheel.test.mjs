import assert from 'node:assert/strict'
import {
  getPageScrollFreezeStyles,
  MOUSE_WHEEL_ZOOM_LOCK_MS,
  getWheelBoundaryAction,
  getWheelDelta,
  getWheelInputKind,
  getWheelScrollLockState,
  getWheelZoomMode,
} from '../src/components/journeyWheel.mjs'

assert.ok(
  MOUSE_WHEEL_ZOOM_LOCK_MS >= 1000,
  'mouse wheel zoom should keep the page frozen long enough to avoid mid-gesture release flicker'
)

function wheelEvent({
  deltaX = 0,
  deltaY = 0,
  deltaMode = 0,
  ctrlKey = false,
  wheelDelta,
  webkitWheelDelta,
} = {}) {
  return {
    deltaX,
    deltaY,
    deltaMode,
    ctrlKey,
    wheelDelta,
    webkitWheelDelta,
  }
}

function modeFor(event, isMouseWheelSessionActive = false) {
  return getWheelZoomMode(
    event,
    getWheelDelta(event),
    isMouseWheelSessionActive
  )
}

function kindFor(event, isMouseWheelSessionActive = false) {
  return getWheelInputKind(
    event,
    getWheelDelta(event),
    isMouseWheelSessionActive
  )
}

assert.equal(
  kindFor(
    wheelEvent({
      deltaX: 1,
      deltaY: -420,
      wheelDelta: 120,
    })
  ),
  'mouse-wheel',
  'mouse wheel input should be classified separately from trackpad scrolling'
)

assert.equal(
  kindFor(
    wheelEvent({
      deltaX: 0,
      deltaY: 5.5,
      wheelDelta: -120,
    })
  ),
  'trackpad-scroll',
  'trackpad vertical scroll should be classified separately from mouse wheel zoom'
)

assert.equal(
  kindFor(
    wheelEvent({
      deltaX: 0,
      deltaY: 5.5,
      wheelDelta: -120,
    }),
    true
  ),
  'trackpad-scroll',
  'trackpad vertical scroll should remain page scrolling even during a recent mouse-wheel session'
)

assert.equal(
  kindFor(
    wheelEvent({
      deltaX: 4,
      deltaY: -80,
      ctrlKey: true,
    })
  ),
  'trackpad-pinch',
  'trackpad pinch should have its own zoom path'
)

assert.equal(
  modeFor(
    wheelEvent({
      deltaX: 1,
      deltaY: -420,
      wheelDelta: 120,
    })
  ),
  'mouse',
  'mouse wheel events with tiny horizontal jitter should still zoom the map'
)

assert.equal(
  modeFor(
    wheelEvent({
      deltaX: 3,
      deltaY: -80,
      ctrlKey: true,
    })
  ),
  'pinch',
  'trackpad pinch wheel events should zoom even if they carry horizontal delta'
)

assert.equal(
  modeFor(
    wheelEvent({
      deltaX: 0,
      deltaY: 5.5,
      wheelDelta: -120,
    })
  ),
  null,
  'trackpad two-finger vertical scroll should remain page scrolling'
)

assert.equal(
  modeFor(
    wheelEvent({
      deltaX: 30,
      deltaY: 8,
      wheelDelta: -120,
    })
  ),
  null,
  'mostly horizontal touchpad scrolling should not zoom the map'
)

const firstLock = getWheelScrollLockState(null, {
  scrollX: 0,
  scrollY: 382,
  now: 1000,
  duration: 420,
})

const extendedLock = getWheelScrollLockState(firstLock, {
  scrollX: 0,
  scrollY: 384,
  now: 1100,
  duration: 420,
})

assert.equal(
  extendedLock.scrollY,
  382,
  'wheel zoom scroll lock should keep the original page position for the whole wheel session'
)

assert.equal(
  extendedLock.lockUntil,
  1520,
  'wheel zoom scroll lock should extend the same anchored lock instead of starting a drifting lock'
)

const newLockAfterIdle = getWheelScrollLockState(extendedLock, {
  scrollX: 0,
  scrollY: 410,
  now: 1600,
  duration: 420,
})

assert.equal(
  newLockAfterIdle.scrollY,
  410,
  'a new wheel session after the lock expires should anchor at the current page position'
)

assert.deepEqual(
  getPageScrollFreezeStyles({ scrollX: 3, scrollY: 382 }),
  {
    position: 'fixed',
    top: '-382px',
    left: '-3px',
    right: '0',
    width: '100%',
    overflow: 'hidden',
    overscrollBehavior: 'none',
  },
  'mouse wheel zoom should freeze the page at the current visual scroll offset'
)

assert.equal(
  getWheelBoundaryAction({
    inputKind: 'mouse-wheel',
    scale: 1,
    minZoom: 1,
    maxZoom: 5.4,
    deltaY: 80,
  }),
  'page-scroll',
  'mouse wheel zoom-out at minimum map zoom should hand control back to page scrolling'
)

assert.equal(
  getWheelBoundaryAction({
    inputKind: 'mouse-wheel',
    scale: 5.4,
    minZoom: 1,
    maxZoom: 5.4,
    deltaY: -80,
  }),
  'map-zoom',
  'mouse wheel zoom-in at maximum map zoom should remain captured by the map'
)

assert.equal(
  getWheelBoundaryAction({
    inputKind: 'trackpad-pinch',
    scale: 1,
    minZoom: 1,
    maxZoom: 5.4,
    deltaY: 80,
  }),
  'map-zoom',
  'trackpad pinch should stay a map zoom gesture at zoom limits'
)
