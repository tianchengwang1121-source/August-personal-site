import assert from 'node:assert/strict'
import { getWheelDelta, getWheelZoomMode } from '../src/components/journeyWheel.mjs'

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
