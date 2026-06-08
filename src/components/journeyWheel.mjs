export function getWheelDelta(event) {
  const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1

  return {
    x: event.deltaX * deltaMultiplier,
    y: event.deltaY * deltaMultiplier,
  }
}

function isVerticalWheelIntent(delta) {
  const absX = Math.abs(delta.x)
  const absY = Math.abs(delta.y)

  return absY > 0 && absY >= absX * 2
}

export function getWheelZoomMode(
  event,
  delta,
  isMouseWheelSessionActive = false
) {
  const wheelDelta = Math.abs(event.wheelDelta || event.webkitWheelDelta || 0)
  const absDeltaY = Math.abs(event.deltaY)

  if (event.ctrlKey) {
    return 'pinch'
  }

  if (!isVerticalWheelIntent(delta)) {
    return null
  }

  if (isMouseWheelSessionActive && absDeltaY > 0) {
    return 'mouse'
  }

  if (event.deltaMode !== 0) {
    return 'mouse'
  }

  if (wheelDelta) {
    const isMouseWheel =
      Number.isInteger(event.deltaY) && wheelDelta >= 80 && absDeltaY >= 1

    return isMouseWheel ? 'mouse' : null
  }

  return Number.isInteger(event.deltaY) && absDeltaY >= 40 ? 'mouse' : null
}
