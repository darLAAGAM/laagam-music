import { ReactNode } from 'react'
import styled from 'styled-components'
import { iPodTheme } from '../../styles/theme'

interface IPodScreenProps {
  children: ReactNode
}

export function IPodScreen({ children }: IPodScreenProps) {
  return (
    <ScreenContainer>
      {/* Black bezel frame */}
      <ScreenBezel>
        {/* LCD display area */}
        <LCDScreen>
          {children}
        </LCDScreen>
      </ScreenBezel>
    </ScreenContainer>
  )
}

const ScreenContainer = styled.div`
  margin-bottom: ${iPodTheme.dimensions.wheelGap}px;
`

const ScreenBezel = styled.div`
  background: #000000;
  border-radius: 6px;
  padding: 6px;
  box-shadow:
    inset 0 1px 3px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.1);
`

const LCDScreen = styled.div`
  width: ${iPodTheme.dimensions.screenWidth}px;
  height: ${iPodTheme.dimensions.screenHeight}px;
  background: ${iPodTheme.screen.background};
  border-radius: ${iPodTheme.dimensions.screenRadius}px;
  overflow: hidden;
  position: relative;

  /* Subtle LCD effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.02) 100%
    );
    pointer-events: none;
  }
`
