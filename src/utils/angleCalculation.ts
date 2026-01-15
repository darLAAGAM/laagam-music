export function calculateAngle(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number
): number {
  const dx = pointX - centerX
  const dy = pointY - centerY

  let angle = Math.atan2(dy, dx) * (180 / Math.PI)
  angle = angle + 90

  if (angle < 0) {
    angle += 360
  }

  return angle
}

export function calculateAngleDelta(previousAngle: number, currentAngle: number): number {
  let delta = currentAngle - previousAngle

  if (delta > 180) {
    delta -= 360
  } else if (delta < -180) {
    delta += 360
  }

  return delta
}

export function isPointInWheelArea(
  centerX: number,
  centerY: number,
  pointX: number,
  pointY: number,
  innerRadius: number,
  outerRadius: number
): boolean {
  const distance = Math.sqrt(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2))

  return distance >= innerRadius && distance <= outerRadius
}

export function getQuadrant(angle: number): 'top' | 'right' | 'bottom' | 'left' {
  if (angle >= 315 || angle < 45) return 'top'
  if (angle >= 45 && angle < 135) return 'right'
  if (angle >= 135 && angle < 225) return 'bottom'
  return 'left'
}
