import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { iPodTheme } from '../../styles/theme'

interface AddPlaylistScreenProps {
  onAdd: (url: string) => void
  onCancel: () => void
  error?: string | null
}

type MenuOption = 'paste' | 'clear' | 'add'

const menuOptions: { id: MenuOption; label: string }[] = [
  { id: 'paste', label: 'Paste from Clipboard' },
  { id: 'clear', label: 'Clear' },
  { id: 'add', label: 'Add to Library' },
]

export function AddPlaylistScreen({ onAdd, onCancel, error }: AddPlaylistScreenProps) {
  const [url, setUrl] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [time, setTime] = useState(new Date())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handlePaste = useCallback(async () => {
    // First try the clipboard API
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text)
        return
      }
    } catch {
      // Clipboard API failed (common on mobile)
    }

    // Fallback: focus input so user can paste manually
    setIsEditing(true)
    // Small delay to ensure input is rendered and focused
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [])

  const handleClear = useCallback(() => {
    setUrl('')
  }, [])

  const handleAdd = useCallback(() => {
    if (url.trim()) {
      onAdd(url.trim())
    }
  }, [url, onAdd])

  const handleSelect = useCallback(() => {
    if (isEditing) {
      setIsEditing(false)
      return
    }

    const option = menuOptions[selectedIndex]
    switch (option.id) {
      case 'paste':
        handlePaste()
        break
      case 'clear':
        handleClear()
        break
      case 'add':
        handleAdd()
        break
    }
  }, [selectedIndex, isEditing, handlePaste, handleClear, handleAdd])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault()
          setIsEditing(false)
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(0, prev - 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(menuOptions.length - 1, prev + 1))
          break
        case 'Enter':
          e.preventDefault()
          handleSelect()
          break
        case 'Escape':
        case 'Backspace':
          if (!isEditing) {
            e.preventDefault()
            onCancel()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, handleSelect, onCancel])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const truncateUrl = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
  }

  return (
    <Container>
      <TitleBar>
        <TitleText>Add YouTube URL</TitleText>
        <TitleRight>
          <TimeText>{timeString}</TimeText>
          <BatteryIcon>
            <BatteryBody><BatteryFill /></BatteryBody>
            <BatteryTip />
          </BatteryIcon>
        </TitleRight>
      </TitleBar>

      <UrlSection onClick={() => setIsEditing(true)}>
        {isEditing ? (
          <UrlInput
            ref={inputRef}
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onBlur={() => setTimeout(() => setIsEditing(false), 200)}
            placeholder="Hold here to paste URL..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        ) : (
          <UrlText $hasUrl={!!url}>
            {url ? truncateUrl(url, 35) : 'No URL entered'}
          </UrlText>
        )}
      </UrlSection>

      <MenuList>
        {menuOptions.map((option, index) => {
          const isDisabled = option.id === 'add' && !url.trim()
          const isSelected = index === selectedIndex

          const handleTap = () => {
            if (isDisabled) return
            setSelectedIndex(index)
            switch (option.id) {
              case 'paste':
                handlePaste()
                break
              case 'clear':
                handleClear()
                break
              case 'add':
                handleAdd()
                break
            }
          }

          return (
            <MenuItem
              key={option.id}
              $selected={isSelected}
              $disabled={isDisabled}
              onClick={handleTap}
            >
              <ItemLabel $selected={isSelected}>{option.label}</ItemLabel>
              {option.id === 'add' && url.trim() && (
                <ItemArrow $selected={isSelected}>›</ItemArrow>
              )}
            </MenuItem>
          )
        })}
      </MenuList>

      {error && (
        <ErrorBar>
          <ErrorText>{error}</ErrorText>
        </ErrorBar>
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

const UrlSection = styled.div`
  padding: 10px;
  margin: 6px 8px;
  background: #f5f5f5;
  border: 2px solid #999;
  border-radius: 4px;
  cursor: text;
  min-height: 32px;
  display: flex;
  align-items: center;

  &:active {
    border-color: #3a7bd5;
    background: #fff;
  }
`

const UrlText = styled.span<{ $hasUrl: boolean }>`
  font-size: 10px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: ${props => props.$hasUrl ? '#000' : '#888'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UrlInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: #000;
  outline: none;
  width: 100%;
  min-height: 20px;

  &::placeholder {
    color: #666;
  }
`

const MenuList = styled.div`
  flex: 1;
`

const MenuItem = styled.div<{ $selected: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  height: 26px;
  background: ${props => props.$selected ? iPodTheme.screen.selection : 'transparent'};
  opacity: ${props => props.$disabled ? 0.4 : 1};
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: ${iPodTheme.screen.selection};
  }
`

const ItemLabel = styled.span<{ $selected: boolean }>`
  font-size: 12px;
  color: ${props => props.$selected ? '#fff' : '#000'};
`

const ItemArrow = styled.span<{ $selected: boolean }>`
  font-size: 14px;
  font-weight: 300;
  color: ${props => props.$selected ? '#fff' : '#666'};
`

const ErrorBar = styled.div`
  padding: 4px 8px;
  background: #fee;
  border-top: 1px solid #fcc;
`

const ErrorText = styled.div`
  font-size: 10px;
  color: #c00;
  text-align: center;
`
