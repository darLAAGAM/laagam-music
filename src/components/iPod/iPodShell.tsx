import { ReactNode } from 'react'
import { ShellVariant } from '../../styles/theme'
import './iPod.css'

interface IPodShellProps {
  variant: ShellVariant
  children: ReactNode
}

export function IPodShell({ variant, children }: IPodShellProps) {
  return (
    <div className="ipod-shell-wrapper">
      {/* Chrome/metal edge frame */}
      <div className={`ipod-edge-frame ${variant}`}>
        {/* Main front panel */}
        <div className={`ipod-front-panel ${variant}`}>
          {/* Content area */}
          <div className="ipod-content-area">
            {children}
          </div>

          {/* Subtle top highlight */}
          <div className={`ipod-top-highlight ${variant}`} />
        </div>
      </div>
    </div>
  )
}
