import { ReactNode } from 'react'
import './iPod.css'

interface IPodScreenProps {
  children: ReactNode
}

export function IPodScreen({ children }: IPodScreenProps) {
  return (
    <div className="ipod-screen-container">
      {/* Black bezel frame */}
      <div className="ipod-screen-bezel">
        {/* LCD display area */}
        <div className="ipod-lcd-screen">
          {children}
        </div>
      </div>
    </div>
  )
}
