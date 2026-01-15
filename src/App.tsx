import { useEffect, useState, useCallback } from 'react'
import { NavigationProvider, useNavigation } from './context/NavigationContext'
import { YouTubePlayerProvider, useYouTubePlayer } from './context/YouTubePlayerContext'
import { IPodShell } from './components/iPod/iPodShell'
import { IPodScreen } from './components/iPod/iPodScreen'
import { ClickWheel } from './components/ClickWheel/ClickWheel'
import { ScreenContainer } from './components/Screen/ScreenContainer'
import { LaagamLanding } from './components/Landing/LaagamLanding'
import { ShellVariant } from './styles/theme'

function IPodDevice() {
  const { state, currentMenu, scrollUp, scrollDown, goBack, selectItem } = useNavigation()
  const { togglePlay, nextTrack, previousTrack, adjustVolume } = useYouTubePlayer()
  const [variant] = useState<ShellVariant>('silver')

  const handleSelect = useCallback(() => {
    if (state.screenType === 'addPlaylist') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      return
    }

    if (state.screenType === 'nowPlaying') {
      togglePlay()
      return
    }

    if (currentMenu && currentMenu.items.length > 0) {
      const selectedItem = currentMenu.items[state.selectedIndex]
      if (selectedItem) {
        selectItem(selectedItem)
      }
    }
  }, [currentMenu, state.selectedIndex, state.screenType, selectItem, togglePlay])

  const handleMenu = useCallback(() => {
    goBack()
  }, [goBack])

  const handleScrollUp = useCallback(() => {
    if (state.screenType === 'menu') {
      scrollUp()
    } else if (state.screenType === 'nowPlaying') {
      adjustVolume(5)
    } else if (state.screenType === 'addPlaylist') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    }
  }, [state.screenType, scrollUp, adjustVolume])

  const handleScrollDown = useCallback(() => {
    if (state.screenType === 'menu') {
      scrollDown()
    } else if (state.screenType === 'nowPlaying') {
      adjustVolume(-5)
    } else if (state.screenType === 'addPlaylist') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    }
  }, [state.screenType, scrollDown, adjustVolume])

  const handlePlayPause = useCallback(() => {
    togglePlay()
  }, [togglePlay])

  const handleNext = useCallback(() => {
    nextTrack()
  }, [nextTrack])

  const handlePrev = useCallback(() => {
    previousTrack()
  }, [previousTrack])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (state.screenType === 'addPlaylist') {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault()
          goBack()
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          handleScrollUp()
          break
        case 'ArrowDown':
          e.preventDefault()
          handleScrollDown()
          break
        case 'Enter':
          e.preventDefault()
          handleSelect()
          break
        case 'Escape':
        case 'Backspace':
          e.preventDefault()
          goBack()
          break
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleScrollUp, handleScrollDown, handleSelect, goBack, handlePlayPause, handleNext, handlePrev, state.screenType])

  return (
    <IPodShell variant={variant}>
      <IPodScreen>
        <ScreenContainer />
      </IPodScreen>
      <ClickWheel
        variant={variant}
        onScrollUp={handleScrollUp}
        onScrollDown={handleScrollDown}
        onMenu={handleMenu}
        onSelect={handleSelect}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </IPodShell>
  )
}

export default function App() {
  return (
    <YouTubePlayerProvider>
      <NavigationProvider>
        <LaagamLanding>
          <IPodDevice />
        </LaagamLanding>
      </NavigationProvider>
    </YouTubePlayerProvider>
  )
}
