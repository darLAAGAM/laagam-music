import { useState, useEffect, useRef, useCallback } from 'react'
import './Screen.css'

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
    <div className="add-playlist-screen">
      <div className="ipod-title-bar">
        <span className="ipod-title-text">Add YouTube URL</span>
        <div className="ipod-title-right">
          <span className="ipod-time-text">{timeString}</span>
          <div className="ipod-battery-icon">
            <div className="ipod-battery-body"><div className="ipod-battery-fill" /></div>
            <div className="ipod-battery-tip" />
          </div>
        </div>
      </div>

      <div className="add-playlist-url-section" onClick={() => setIsEditing(true)}>
        {isEditing ? (
          <input
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
            className="add-playlist-url-input"
          />
        ) : (
          <span className={`add-playlist-url-text ${url ? 'has-url' : 'no-url'}`}>
            {url ? truncateUrl(url, 35) : 'No URL entered'}
          </span>
        )}
      </div>

      <div className="add-playlist-menu-list">
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
            <div
              key={option.id}
              className={`add-playlist-menu-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={handleTap}
            >
              <span className="add-playlist-item-label">{option.label}</span>
              {option.id === 'add' && url.trim() && (
                <span className="add-playlist-item-arrow">›</span>
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="add-playlist-error-bar">
          <div className="add-playlist-error-text">{error}</div>
        </div>
      )}
    </div>
  )
}
