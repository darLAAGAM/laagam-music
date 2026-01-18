import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigation } from '../../context/NavigationContext'
import { useYouTubePlayer } from '../../context/YouTubePlayerContext'
import { MenuScreen } from './MenuScreen'
import { NowPlayingScreen } from './NowPlayingScreen'
import { AddPlaylistScreen } from './AddPlaylistScreen'
import './Screen.css'

const screenVariants = {
  enter: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'back') => ({
    x: direction === 'forward' ? '-100%' : '100%',
    opacity: 0,
  }),
}

const screenTransition = {
  type: 'tween' as const,
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
}

export function ScreenContainer() {
  const { state, currentMenu, addVideo, goBack } = useNavigation()
  const { loadContent, isReady } = useYouTubePlayer()
  const lastLoadedRef = useRef<number | null>(null)

  // Load video/playlist when currentVideo changes AND player is ready
  // Using timestamp to force reload even for same content
  useEffect(() => {
    const video = state.currentVideo

    // Don't load if player isn't ready yet
    if (!isReady) {
      console.log('ScreenContainer - Player not ready yet, waiting...')
      return
    }

    if (video && video.timestamp !== lastLoadedRef.current) {
      console.log('ScreenContainer - Loading new content:', {
        youtubeId: video.youtubeId,
        contentType: video.contentType,
        timestamp: video.timestamp,
        lastLoaded: lastLoadedRef.current,
        isReady
      })
      lastLoadedRef.current = video.timestamp
      loadContent(video.youtubeId, video.contentType, video.title)
    }
  }, [state.currentVideo, loadContent, isReady])

  const handleAddVideo = async (url: string) => {
    await addVideo(url)
  }

  return (
    <div className="screen-container">
      <AnimatePresence mode="wait" custom={state.direction}>
        {state.screenType === 'menu' && currentMenu && (
          <motion.div
            key={`menu-${state.currentMenuId}`}
            custom={state.direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={screenTransition}
            className="screen-motion"
          >
            <MenuScreen
              title={currentMenu.title}
              items={currentMenu.items}
              selectedIndex={state.selectedIndex}
            />
          </motion.div>
        )}

        {state.screenType === 'nowPlaying' && (
          <motion.div
            key="now-playing"
            custom={state.direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={screenTransition}
            className="screen-motion"
          >
            <NowPlayingScreen />
          </motion.div>
        )}

        {state.screenType === 'addPlaylist' && (
          <motion.div
            key="add-playlist"
            custom={state.direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={screenTransition}
            className="screen-motion"
          >
            <AddPlaylistScreen
              onAdd={handleAddVideo}
              onCancel={goBack}
              error={state.addPlaylistError}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
