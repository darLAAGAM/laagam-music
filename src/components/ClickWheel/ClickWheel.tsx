import { useCallback, useState } from 'react'
import { useWheelRotation } from '../../hooks/useWheelRotation'
import { ShellVariant } from '../../styles/theme'
import './ClickWheel.css'

interface ClickWheelProps {
  variant: ShellVariant
  onScrollUp: () => void
  onScrollDown: () => void
  onMenu: () => void
  onSelect: () => void
  onPlayPause: () => void
  onNext: () => void
  onPrev: () => void
  disabled?: boolean
}

const WHEEL_SIZE = 168
const CENTER_SIZE = 56
const INNER_RADIUS = CENTER_SIZE / 2
const OUTER_RADIUS = WHEEL_SIZE / 2
const ROTATION_SENSITIVITY = 15

export function ClickWheel({
  variant,
  onScrollUp,
  onScrollDown,
  onMenu,
  onSelect,
  onPlayPause,
  onNext,
  onPrev,
  disabled = false,
}: ClickWheelProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null)

  const handleRotate = useCallback(
    (direction: 'cw' | 'ccw', steps: number) => {
      if (disabled) return
      for (let i = 0; i < steps; i++) {
        if (direction === 'cw') {
          onScrollDown()
        } else {
          onScrollUp()
        }
      }
    },
    [disabled, onScrollDown, onScrollUp]
  )

  const { wheelRef, handlers } = useWheelRotation({
    innerRadius: INNER_RADIUS,
    outerRadius: OUTER_RADIUS,
    sensitivity: ROTATION_SENSITIVITY,
    onRotate: handleRotate,
  })

  const handleButtonPress = (buttonId: string, action: () => void) => {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        e.stopPropagation()
        if (!disabled) {
          setActiveButton(buttonId)
        }
      },
      onPointerUp: (e: React.PointerEvent) => {
        e.stopPropagation()
        if (!disabled && activeButton === buttonId) {
          action()
        }
        setActiveButton(null)
      },
      onPointerLeave: () => {
        setActiveButton(null)
      },
    }
  }

  return (
    <div
      ref={wheelRef}
      {...handlers}
      className={`click-wheel ${variant} ${disabled ? 'disabled' : ''}`}
    >
      {/* MENU text at top */}
      <button
        className={`wheel-button wheel-button-menu ${variant} ${activeButton === 'menu' ? 'active' : ''}`}
        {...handleButtonPress('menu', onMenu)}
      >
        MENU
      </button>

      {/* Previous (rewind) at left ◀◀ */}
      <button
        className={`wheel-button wheel-button-prev ${variant} ${activeButton === 'prev' ? 'active' : ''}`}
        {...handleButtonPress('prev', onPrev)}
      >
        <svg viewBox="0 0 24 16" width="20" height="14">
          <polygon fill="currentColor" points="12,0 12,16 2,8"/>
          <polygon fill="currentColor" points="22,0 22,16 12,8"/>
        </svg>
      </button>

      {/* Next (forward) at right ▶▶ */}
      <button
        className={`wheel-button wheel-button-next ${variant} ${activeButton === 'next' ? 'active' : ''}`}
        {...handleButtonPress('next', onNext)}
      >
        <svg viewBox="0 0 24 16" width="20" height="14">
          <polygon fill="currentColor" points="2,0 12,8 2,16"/>
          <polygon fill="currentColor" points="12,0 22,8 12,16"/>
        </svg>
      </button>

      {/* Play/Pause at bottom */}
      <button
        className={`wheel-button wheel-button-playpause ${variant} ${activeButton === 'playpause' ? 'active' : ''}`}
        {...handleButtonPress('playpause', onPlayPause)}
      >
        <svg viewBox="0 0 24 16" width="22" height="15">
          <path fill="currentColor" d="M0 0v16l10-8L0 0zm12 3h3v10h-3zm6 0h3v10h-3z"/>
        </svg>
      </button>

      {/* Center select button */}
      <button
        className={`click-wheel-center ${variant} ${activeButton === 'select' ? 'active' : ''}`}
        {...handleButtonPress('select', onSelect)}
      />
    </div>
  )
}
