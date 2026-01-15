import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { iPodTheme } from '../../styles/theme'

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
    <Container>
      {/* Title bar - iPod Classic style */}
      <TitleBar>
        <TitleText>{title}</TitleText>
        <TitleRight>
          <TimeText>{timeString}</TimeText>
          <BatteryIcon>
            <BatteryBody>
              <BatteryFill />
            </BatteryBody>
            <BatteryTip />
          </BatteryIcon>
        </TitleRight>
      </TitleBar>

      {/* Menu items */}
      <MenuArea>
        {items.length === 0 ? (
          <EmptyMessage>No items</EmptyMessage>
        ) : (
          <ScrollContainer
            animate={{ y: -scrollOffset * itemHeight }}
            transition={{ type: 'tween', duration: iPodTheme.animation.scrollSmooth }}
          >
            {items.map((item, index) => {
              const isSelected = index === selectedIndex
              const hasArrow = item.type === 'navigation' || item.type === 'video'

              return (
                <MenuItem key={item.id} $selected={isSelected} $height={itemHeight}>
                  <ItemLabel $selected={isSelected}>
                    {item.label}
                  </ItemLabel>
                  <ItemRight>
                    {item.subtitle && (
                      <ItemSubtitle $selected={isSelected}>
                        {item.subtitle}
                      </ItemSubtitle>
                    )}
                    {hasArrow && (
                      <ItemArrow $selected={isSelected}>›</ItemArrow>
                    )}
                  </ItemRight>
                </MenuItem>
              )
            })}
          </ScrollContainer>
        )}
      </MenuArea>

      {/* Scrollbar - only show if needed */}
      {items.length > visibleItems && (
        <ScrollbarTrack>
          <ScrollbarThumb
            style={{
              height: `${(visibleItems / items.length) * 100}%`,
              top: `${(scrollOffset / (items.length - visibleItems)) * (100 - (visibleItems / items.length) * 100)}%`,
            }}
          />
        </ScrollbarTrack>
      )}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(180deg, #b8b8b8 0%, #9a9a9a 50%, #8a8a8a 100%);
  min-height: 18px;
  border-bottom: 1px solid #6a6a6a;
`

const TitleText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #000;
`

const TitleRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const TimeText = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: #000;
`

const BatteryIcon = styled.div`
  display: flex;
  align-items: center;
`

const BatteryBody = styled.div`
  width: 16px;
  height: 8px;
  border: 1px solid #000;
  border-radius: 1px;
  padding: 1px;
  background: #fff;
`

const BatteryFill = styled.div`
  width: 100%;
  height: 100%;
  background: #4cd964;
  border-radius: 0.5px;
`

const BatteryTip = styled.div`
  width: 2px;
  height: 4px;
  background: #000;
  border-radius: 0 1px 1px 0;
`

const MenuArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`

const ScrollContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
`

const MenuItem = styled.div<{ $selected: boolean; $height: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  height: ${props => props.$height}px;
  background: ${props => props.$selected ? iPodTheme.screen.selection : 'transparent'};
`

const ItemLabel = styled.span<{ $selected: boolean }>`
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.$selected ? '#fff' : '#000'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const ItemSubtitle = styled.span<{ $selected: boolean }>`
  font-size: 10px;
  color: ${props => props.$selected ? 'rgba(255,255,255,0.8)' : '#666'};
`

const ItemArrow = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.$selected ? '#fff' : '#666'};
  line-height: 1;
`

const ScrollbarTrack = styled.div`
  position: absolute;
  right: 1px;
  top: 20px;
  bottom: 1px;
  width: 6px;
  background: rgba(0, 0, 0, 0.05);
`

const ScrollbarThumb = styled.div`
  position: absolute;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  min-height: 20px;
`

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 12px;
  color: #666;
`
