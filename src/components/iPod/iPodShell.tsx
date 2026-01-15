import { ReactNode } from 'react'
import styled from 'styled-components'
import { iPodTheme, ShellVariant } from '../../styles/theme'

interface IPodShellProps {
  variant: ShellVariant
  children: ReactNode
}

export function IPodShell({ variant, children }: IPodShellProps) {
  return (
    <ShellWrapper>
      {/* Chrome/metal edge frame */}
      <EdgeFrame $variant={variant}>
        {/* Main front panel */}
        <FrontPanel $variant={variant}>
          {/* Content area */}
          <ContentArea>
            {children}
          </ContentArea>

          {/* Subtle top highlight */}
          <TopHighlight $variant={variant} />
        </FrontPanel>
      </EdgeFrame>
    </ShellWrapper>
  )
}

const ShellWrapper = styled.div`
  position: relative;
`

const EdgeFrame = styled.div<{ $variant: ShellVariant }>`
  padding: 3px;
  background: ${props => iPodTheme.shell[props.$variant].edge};
  border-radius: ${iPodTheme.dimensions.shellRadius + 2}px;
  box-shadow: ${props => iPodTheme.shell[props.$variant].shadow};
`

const FrontPanel = styled.div<{ $variant: ShellVariant }>`
  width: ${iPodTheme.dimensions.shellWidth}px;
  height: ${iPodTheme.dimensions.shellHeight}px;
  background: ${props => iPodTheme.shell[props.$variant].front};
  border-radius: ${iPodTheme.dimensions.shellRadius}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 24px 0 20px;
  position: relative;
  z-index: 1;
`

const TopHighlight = styled.div<{ $variant: ShellVariant }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(
    180deg,
    ${props => props.$variant === 'silver'
      ? 'rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 100%'
      : 'rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 100%'
    }
  );
  pointer-events: none;
  border-radius: ${iPodTheme.dimensions.shellRadius}px ${iPodTheme.dimensions.shellRadius}px 0 0;
`
