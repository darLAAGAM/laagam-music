import { useCallback, useRef } from 'react'
import { calculateAngle, calculateAngleDelta, isPointInWheelArea } from '../utils/angleCalculation'

interface WheelRotationConfig {
  innerRadius: number
  outerRadius: number
  sensitivity: number
  onRotate: (direction: 'cw' | 'ccw', steps: number) => void
}

interface WheelState {
  isActive: boolean
  currentAngle: number
  accumulatedDelta: number
}

export function useWheelRotation(config: WheelRotationConfig) {
  const { innerRadius, outerRadius, sensitivity, onRotate } = config

  const wheelRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<WheelState>({
    isActive: false,
    currentAngle: 0,
    accumulatedDelta: 0,
  })

  const getWheelCenter = useCallback(() => {
    if (!wheelRef.current) return { x: 0, y: 0 }

    const rect = wheelRef.current.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const center = getWheelCenter()
      const clientX = e.clientX
      const clientY = e.clientY

      if (!isPointInWheelArea(center.x, center.y, clientX, clientY, innerRadius, outerRadius)) {
        return
      }

      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      const angle = calculateAngle(center.x, center.y, clientX, clientY)

      stateRef.current = {
        isActive: true,
        currentAngle: angle,
        accumulatedDelta: 0,
      }
    },
    [getWheelCenter, innerRadius, outerRadius]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!stateRef.current.isActive) return

      const center = getWheelCenter()
      const newAngle = calculateAngle(center.x, center.y, e.clientX, e.clientY)
      const delta = calculateAngleDelta(stateRef.current.currentAngle, newAngle)

      stateRef.current.currentAngle = newAngle
      stateRef.current.accumulatedDelta += delta

      const steps = Math.floor(Math.abs(stateRef.current.accumulatedDelta) / sensitivity)

      if (steps > 0) {
        const direction = stateRef.current.accumulatedDelta > 0 ? 'cw' : 'ccw'
        onRotate(direction, steps)

        const consumed = steps * sensitivity * Math.sign(stateRef.current.accumulatedDelta)
        stateRef.current.accumulatedDelta -= consumed
      }
    },
    [getWheelCenter, sensitivity, onRotate]
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    stateRef.current.isActive = false
    stateRef.current.accumulatedDelta = 0
  }, [])

  return {
    wheelRef,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
    },
  }
}
