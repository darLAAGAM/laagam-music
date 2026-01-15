import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  thumbnailUrl: string
  duration: number
}

interface PlayerState {
  isReady: boolean
  isPlaying: boolean
  currentTrack: Track | null
  position: number
  duration: number
  volume: number
  isPlaylist: boolean
}

interface YouTubePlayerContextType extends PlayerState {
  loadVideo: (videoId: string, title?: string) => void
  loadPlaylist: (playlistId: string, title?: string) => void
  loadContent: (id: string, type: 'video' | 'playlist', title?: string) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (position: number) => void
  seekRelative: (delta: number) => void
  setVolume: (volume: number) => void
  adjustVolume: (delta: number) => void
  nextTrack: () => void
  previousTrack: () => void
}

const YouTubePlayerContext = createContext<YouTubePlayerContextType | null>(null)

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height: string
          width: string
          videoId?: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (event: { target: YTPlayer }) => void
            onStateChange?: (event: { data: number; target: YTPlayer }) => void
            onError?: (event: { data: number }) => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        UNSTARTED: number
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  nextVideo: () => void
  previousVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  getCurrentTime: () => number
  getDuration: () => number
  getVideoData: () => { title: string; author: string; video_id: string }
  loadVideoById: (videoId: string) => void
  cuePlaylist: (config: { listType: string; list: string; index?: number }) => void
  loadPlaylist: (config: { listType: string; list: string; index?: number }) => void
  destroy: () => void
}

export function YouTubePlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isAPIReady, setIsAPIReady] = useState(false)
  const pendingTitleRef = useRef<string | null>(null)

  const [state, setState] = useState<PlayerState>({
    isReady: false,
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 100,
    isPlaylist: false,
  })

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.body.appendChild(script)

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Initialize player when API is ready
  useEffect(() => {
    if (!isAPIReady || playerRef.current) return

    // Create hidden container for the player
    // Using visibility:hidden and small but valid dimensions to avoid API restrictions
    const container = document.createElement('div')
    container.id = 'youtube-player-container'
    container.style.position = 'fixed'
    container.style.bottom = '0'
    container.style.right = '0'
    container.style.width = '200px'
    container.style.height = '150px'
    container.style.visibility = 'hidden'
    container.style.pointerEvents = 'none'
    document.body.appendChild(container)
    containerRef.current = container

    const playerDiv = document.createElement('div')
    playerDiv.id = 'youtube-player'
    container.appendChild(playerDiv)

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '150',
      width: '200',
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        origin: window.location.origin,
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          console.log('YouTube Player is now READY!')
          setState(prev => ({ ...prev, isReady: true }))
        },
        onStateChange: (event) => {
          console.log('YouTube state change:', event.data, {
            UNSTARTED: window.YT.PlayerState.UNSTARTED,
            ENDED: window.YT.PlayerState.ENDED,
            PLAYING: window.YT.PlayerState.PLAYING,
            PAUSED: window.YT.PlayerState.PAUSED,
            BUFFERING: window.YT.PlayerState.BUFFERING,
            CUED: window.YT.PlayerState.CUED,
          })

          const isPlaying = event.data === window.YT.PlayerState.PLAYING
          const isPaused = event.data === window.YT.PlayerState.PAUSED
          const isCued = event.data === window.YT.PlayerState.CUED

          if (isPlaying || isPaused || isCued) {
            const player = event.target
            const videoData = player.getVideoData()
            const duration = player.getDuration()
            const videoId = videoData.video_id

            setState(prev => ({
              ...prev,
              isPlaying,
              duration: duration || prev.duration,
              currentTrack: {
                id: videoId || prev.currentTrack?.id || '',
                title: videoData.title || pendingTitleRef.current || prev.currentTrack?.title || 'Loading...',
                artist: videoData.author || prev.currentTrack?.artist || '',
                thumbnailUrl: videoId
                  ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                  : prev.currentTrack?.thumbnailUrl || '',
                duration: duration || prev.currentTrack?.duration || 0,
              },
            }))
          }

          if (event.data === window.YT.PlayerState.ENDED) {
            setState(prev => ({ ...prev, isPlaying: false, position: prev.duration }))
          }
        },
        onError: (event) => {
          const errorMessages: Record<number, string> = {
            2: 'Invalid parameter - check video/playlist ID',
            5: 'Content cannot be played in HTML5 player',
            100: 'Video not found (removed or private)',
            101: 'Video cannot be embedded (owner blocked)',
            150: 'Video cannot be embedded (owner blocked)',
          }
          console.error('YouTube player error:', event.data, errorMessages[event.data] || 'Unknown error')
        },
      },
    })

    return () => {
      playerRef.current?.destroy()
      containerRef.current?.remove()
    }
  }, [isAPIReady])

  // Update position periodically
  useEffect(() => {
    if (!state.isPlaying) return

    const interval = setInterval(() => {
      if (playerRef.current) {
        const position = playerRef.current.getCurrentTime()
        setState(prev => ({ ...prev, position }))
      }
    }, 500)

    return () => clearInterval(interval)
  }, [state.isPlaying])

  const loadVideo = useCallback((videoId: string, title?: string) => {
    if (!playerRef.current) return

    pendingTitleRef.current = title || null

    setState(prev => ({
      ...prev,
      isPlaylist: false,
      currentTrack: {
        id: videoId,
        title: title || 'Loading...',
        artist: '',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        duration: 0,
      },
      position: 0,
      duration: 0,
    }))

    playerRef.current.loadVideoById(videoId)
  }, [])

  const loadPlaylistFn = useCallback((playlistId: string, title?: string) => {
    console.log('loadPlaylistFn called:', { playlistId, title, playerExists: !!playerRef.current, isReady: state.isReady })

    if (!playerRef.current) {
      console.error('loadPlaylistFn: playerRef.current is null!')
      return
    }

    if (!state.isReady) {
      console.warn('loadPlaylistFn: Player not ready yet!')
      return
    }

    pendingTitleRef.current = title || null

    // Stop current playback first to ensure clean state
    try {
      playerRef.current.pauseVideo()
    } catch (e) {
      console.warn('pauseVideo failed:', e)
    }

    setState(prev => ({
      ...prev,
      isPlaylist: true,
      isPlaying: false,
      currentTrack: {
        id: playlistId,
        title: title || 'Loading playlist...',
        artist: '',
        thumbnailUrl: '',
        duration: 0,
      },
      position: 0,
      duration: 0,
    }))

    // Load playlist with detailed logging
    console.log('=== PLAYLIST LOAD DEBUG ===')
    console.log('Playlist ID:', playlistId)
    console.log('Playlist ID length:', playlistId.length)
    console.log('Playlist ID type:', typeof playlistId)
    console.log('Player ready:', state.isReady)
    console.log('Player ref exists:', !!playerRef.current)

    // Delay to ensure player is fully initialized
    setTimeout(() => {
      if (!playerRef.current) {
        console.error('Player ref lost during timeout')
        return
      }

      console.log('Calling loadPlaylist with object format...')
      try {
        playerRef.current.loadPlaylist({
          listType: 'playlist',
          list: playlistId,
          index: 0
        })
        console.log('loadPlaylist call completed without error')
      } catch (e) {
        console.error('loadPlaylist threw exception:', e)
      }
    }, 1000)
  }, [state.isReady])

  const loadContent = useCallback((id: string, type: 'video' | 'playlist', title?: string) => {
    if (type === 'playlist') {
      loadPlaylistFn(id, title)
    } else {
      loadVideo(id, title)
    }
  }, [loadVideo, loadPlaylistFn])

  const play = useCallback(() => {
    playerRef.current?.playVideo()
  }, [])

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo()
  }, [])

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, play, pause])

  const seek = useCallback((position: number) => {
    playerRef.current?.seekTo(position, true)
    setState(prev => ({ ...prev, position }))
  }, [])

  const seekRelative = useCallback((delta: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime()
      const duration = playerRef.current.getDuration()
      const newPosition = Math.max(0, Math.min(duration, currentTime + delta))
      playerRef.current.seekTo(newPosition, true)
      setState(prev => ({ ...prev, position: newPosition }))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume))
    playerRef.current?.setVolume(clampedVolume)
    setState(prev => ({ ...prev, volume: clampedVolume }))
  }, [])

  const adjustVolume = useCallback((delta: number) => {
    setVolume(state.volume + delta)
  }, [state.volume, setVolume])

  const nextTrack = useCallback(() => {
    if (state.isPlaylist) {
      playerRef.current?.nextVideo()
    } else {
      // For single videos, fast forward
      seekRelative(10)
    }
  }, [state.isPlaylist, seekRelative])

  const previousTrack = useCallback(() => {
    if (state.isPlaylist) {
      playerRef.current?.previousVideo()
    } else {
      // For single videos, rewind
      seekRelative(-10)
    }
  }, [state.isPlaylist, seekRelative])

  return (
    <YouTubePlayerContext.Provider
      value={{
        ...state,
        loadVideo,
        loadPlaylist: loadPlaylistFn,
        loadContent,
        play,
        pause,
        togglePlay,
        seek,
        seekRelative,
        setVolume,
        adjustVolume,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </YouTubePlayerContext.Provider>
  )
}

export function useYouTubePlayer() {
  const context = useContext(YouTubePlayerContext)
  if (!context) {
    throw new Error('useYouTubePlayer must be used within YouTubePlayerProvider')
  }
  return context
}
