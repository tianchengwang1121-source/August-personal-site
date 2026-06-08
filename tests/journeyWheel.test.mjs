import assert from 'node:assert/strict'
import {
  getWheelDelta,
  getWheelScrollLockState,
  getWheelZoomMode,
} from '../src/components/journeyWheel.mjs'

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
