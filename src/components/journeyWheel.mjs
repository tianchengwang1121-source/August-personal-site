export function getWheelDelta(event) {
  const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1

  return {
    x: event.deltaX * deltaMultiplier,
    y: event.deltaY * deltaMultiplier,
  }
}

export function getPageScrollFreezeStyles({ scrollX, scrollY }) {
  return {
    position: 'fixed',
    top: `-${scrollY}px`,
    left: `-${scrollX}px`,
    right: '0',
    width: '100%',
    overflow: 'hidden',
    overscrollBehavior: 'none',
  }
}

export function getWheelScrollLockState(
  currentState,
  { scrollX, scrollY, now, duration }
) {
  const lockUntil = now + duration

  if (!currentState || now > currentState.lockUntil) {
    return {
      scrollX,
      scrollY,
      lockUntil,
    }
  }

  return {
    scrollX: currentState.scrollX,
    scrollY: currentState.scrollY,
    lockUntil: Math.max(currentState.lockUntil, lockUntil),
  }
}

function isVerticalWheelIntent(delta) {
  const absX = Math.abs(delta.x)
  const absY = Math.abs(delta.y)

  return absY > 0 && absY >= absX * 2
}

export function getWheelInputKind(
  event,
  delta,
  isMouseWheelSessionActive = false
) {
  const wheelDelta = Math.abs(event.wheelDelta || event.webkitWheelDelta || 0)
  const absDeltaY = Math.abs(event.deltaY)

  if (event.ctrlKey) {
    return 'trackpad-pinch'
  }

  if (!isVerticalWheelIntent(delta)) {
    return 'trackpad-scroll'
  }

  if (
    isMouseWheelSessionActive &&
    Number.isInteger(event.deltaY) &&
    absDeltaY >= 1 &&
    wheelDelta >= 80
  ) {
    return 'mouse-wheel'
  }

  if (event.deltaMode !== 0) {
    return 'mouse-wheel'
  }

  if (wheelDelta) {
    const isMouseWheel =
      Number.isInteger(event.deltaY) && wheelDelta >= 80 && absDeltaY >= 1

    return isMouseWheel ? 'mouse-wheel' : 'trackpad-scroll'
  }

  return 'trackpad-scroll'
}

export function getWheelBoundaryAction({
  inputKind,
  scale,
  minZoom,
  maxZoom,
  deltaY,
}) {
  if (inputKind === 'mouse-wheel' && scale <= minZoom && deltaY > 0) {
    return 'page-scroll'
  }

  if (inputKind === 'mouse-wheel' && scale >= maxZoom && deltaY < 0) {
    return 'map-zoom'
  }

  return 'map-zoom'
}

export function getWheelZoomMode(
  event,
  delta,
  isMouseWheelSessionActive = false
) {
  const inputKind = getWheelInputKind(event, delta, isMouseWheelSessionActive)

  if (inputKind === 'trackpad-pinch') {
    return 'pinch'
  }

  if (inputKind === 'mouse-wheel') {
    return 'mouse'
  }

  return null
}
