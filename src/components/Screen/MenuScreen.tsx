import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Screen.css'

interface MenuItem {
  id: string
  label: string
  type: 'navigation' | 'action' | 'video'
  target?: string
  subtitle?: string
}

interface MenuScreenProps {
  title: string
  items: MenuItem[]
  selectedIndex: number
}

export function MenuScreen({ title, items, selectedIndex }: MenuScreenProps) {
  const [time, setTime] = useState(new Date())
  const visibleItems = 5
  const itemHeight = 22

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Calculate scroll position to keep selected item visible
  const scrollOffset = Math.max(0, Math.min(
    selectedIndex - Math.floor(visibleItems / 2),
    Math.max(0, items.length - visibleItems)
  ))

  const timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="menu-screen">
      {/* Title bar - iPod Classic style */}
      <div className="ipod-title-bar">
        <span className="ipod-title-text">{title}</span>
        <div className="ipod-title-right">
          <span className="ipod-time-text">{timeString}</span>
          <div className="ipod-battery-icon">
            <div className="ipod-battery-body">
              <div className="ipod-battery-fill" />
            </div>
            <div className="ipod-battery-tip" />
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="menu-area">
        {items.length === 0 ? (
          <div className="menu-empty">No items</div>
        ) : (
          <motion.div
            className="menu-scroll-container"
            animate={{ y: -scrollOffset * itemHeight }}
            transition={{ type: 'tween', duration: 0.12 }}
          >
            {items.map((item, index) => {
              const isSelected = index === selectedIndex
              const hasArrow = item.type === 'navigation' || item.type === 'video'

              return (
                <div
                  key={item.id}
                  className={`menu-item ${isSelected ? 'selected' : ''}`}
                  style={{ height: itemHeight }}
                >
                  <span className="menu-item-label">
                    {item.label}
                  </span>
                  <div className="menu-item-right">
                    {item.subtitle && (
                      <span className="menu-item-subtitle">
                        {item.subtitle}
                      </span>
                    )}
                    {hasArrow && (
                      <span className="menu-item-arrow">›</span>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Scrollbar - only show if needed */}
      {items.length > visibleItems && (
        <div className="menu-scrollbar-track">
          <div
            className="menu-scrollbar-thumb"
            style={{
              height: `${(visibleItems / items.length) * 100}%`,
              top: `${(scrollOffset / (items.length - visibleItems)) * (100 - (visibleItems / items.length) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}
