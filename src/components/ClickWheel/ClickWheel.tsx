import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWheelRotation } from '../../hooks/useWheelRotation'
import { iPodTheme, ShellVariant } from '../../styles/theme'

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

const WHEEL_SIZE = iPodTheme.dimensions.wheelSize
const CENTER_SIZE = iPodTheme.dimensions.wheelCenterSize
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
    <WheelContainer
      ref={wheelRef}
      {...handlers}
      $variant={variant}
      $disabled={disabled}
    >
      {/* MENU text at top */}
      <MenuButton
        $variant={variant}
        $active={activeButton === 'menu'}
        {...handleButtonPress('menu', onMenu)}
      >
        MENU
      </MenuButton>

      {/* Previous (rewind) at left ◀◀ */}
      <PrevButton
        $variant={variant}
        $active={activeButton === 'prev'}
        {...handleButtonPress('prev', onPrev)}
      >
        <svg viewBox="0 0 24 16" width="20" height="14">
          <polygon fill="currentColor" points="12,0 12,16 2,8"/>
          <polygon fill="currentColor" points="22,0 22,16 12,8"/>
        </svg>
      </PrevButton>

      {/* Next (forward) at right ▶▶ */}
      <NextButton
        $variant={variant}
        $active={activeButton === 'next'}
        {...handleButtonPress('next', onNext)}
      >
        <svg viewBox="0 0 24 16" width="20" height="14">
          <polygon fill="currentColor" points="2,0 12,8 2,16"/>
          <polygon fill="currentColor" points="12,0 22,8 12,16"/>
        </svg>
      </NextButton>

      {/* Play/Pause at bottom */}
      <PlayPauseButton
        $variant={variant}
        $active={activeButton === 'playpause'}
        {...handleButtonPress('playpause', onPlayPause)}
      >
        <svg viewBox="0 0 24 16" width="22" height="15">
          <path fill="currentColor" d="M0 0v16l10-8L0 0zm12 3h3v10h-3zm6 0h3v10h-3z"/>
        </svg>
      </PlayPauseButton>

      {/* Center select button */}
      <CenterButton
        $variant={variant}
        $active={activeButton === 'select'}
        {...handleButtonPress('select', onSelect)}
      />
    </WheelContainer>
  )
}

const WheelContainer = styled.div<{ $variant: ShellVariant; $disabled: boolean }>`
  width: ${WHEEL_SIZE}px;
  height: ${WHEEL_SIZE}px;
  border-radius: 50%;
  background: ${props => iPodTheme.wheel[props.$variant].background};
  position: relative;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'grab')};
  user-select: none;
  touch-action: none;

  &:active {
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'grabbing')};
  }
`

const CenterButton = styled.button<{ $variant: ShellVariant; $active: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${CENTER_SIZE}px;
  height: ${CENTER_SIZE}px;
  border-radius: 50%;
  border: 1px solid ${props => iPodTheme.wheel[props.$variant].centerBorder};
  background: ${props => iPodTheme.wheel[props.$variant].center};
  cursor: pointer;
  transition: transform ${iPodTheme.animation.buttonPress}s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  ${props => props.$active && `
    transform: translate(-50%, -50%) scale(0.96);
  `}

  &:focus {
    outline: none;
  }
`

const WheelButton = styled.button<{ $variant: ShellVariant; $active: boolean }>`
  position: absolute;
  background: transparent;
  border: none;
  color: ${props => iPodTheme.wheel[props.$variant].text};
  cursor: pointer;
  transition: all ${iPodTheme.animation.buttonPress}s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  ${props => props.$active && `
    color: ${iPodTheme.wheel[props.$variant].activeText};
  `}

  &:focus {
    outline: none;
  }

  svg {
    display: block;
  }
`

const MenuButton = styled(WheelButton)`
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 6px 12px;
`

const PrevButton = styled(WheelButton)`
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
`

const NextButton = styled(WheelButton)`
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
`

const PlayPauseButton = styled(WheelButton)`
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
`
