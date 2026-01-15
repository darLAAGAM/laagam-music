import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  albumArt: string
  duration: number
  uri: string
}

interface PlayerState {
  isReady: boolean
  isPlaying: boolean
  currentTrack: Track | null
  position: number
  duration: number
  volume: number
  shuffle: boolean
  repeatMode: 'off' | 'track' | 'context'
}

interface PlayerContextType extends PlayerState {
  play: (uri?: string, contextUri?: string, offset?: number) => Promise<void>
  pause: () => Promise<void>
  togglePlay: () => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  seek: (position: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  toggleShuffle: () => Promise<void>
  cycleRepeat: () => Promise<void>
}

const PlayerContext = createContext<PlayerContextType | null>(null)

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: typeof Spotify
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { accessToken, getAccessToken, isAuthenticated } = useAuth()
  const playerRef = useRef<Spotify.Player | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  const [state, setState] = useState<PlayerState>({
    isReady: false,
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: 0.5,
    shuffle: false,
    repeatMode: 'off',
  })

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return

    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'iPod Classic Web Player',
        getOAuthToken: async cb => {
          try {
            const token = await getAccessToken()
            cb(token)
          } catch (error) {
            console.error('Failed to get token:', error)
          }
        },
        volume: state.volume,
      })

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player ready with device ID:', device_id)
        setDeviceId(device_id)
        setState(prev => ({ ...prev, isReady: true }))
      })

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device has gone offline:', device_id)
        setState(prev => ({ ...prev, isReady: false }))
      })

      spotifyPlayer.addListener('player_state_changed', spotifyState => {
        if (!spotifyState) return

        const track = spotifyState.track_window.current_track

        setState(prev => ({
          ...prev,
          isPlaying: !spotifyState.paused,
          position: spotifyState.position,
          duration: spotifyState.duration,
          shuffle: spotifyState.shuffle,
          repeatMode:
            spotifyState.repeat_mode === 0
              ? 'off'
              : spotifyState.repeat_mode === 1
                ? 'context'
                : 'track',
          currentTrack: track
            ? {
                id: track.id ?? track.uri,
                name: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                album: track.album.name,
                albumArt: track.album.images[0]?.url || '',
                duration: spotifyState.duration,
                uri: track.uri,
              }
            : null,
        }))
      })

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization error:', message)
      })

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication error:', message)
      })

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account error (Premium required):', message)
      })

      spotifyPlayer.connect()
      playerRef.current = spotifyPlayer
    }

    return () => {
      playerRef.current?.disconnect()
    }
  }, [isAuthenticated, accessToken])

  useEffect(() => {
    if (!state.isPlaying) return

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        position: Math.min(prev.position + 1000, prev.duration),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isPlaying])

  const play = useCallback(
    async (uri?: string, contextUri?: string, offset?: number) => {
      if (!deviceId || !accessToken) return

      const body: Record<string, unknown> = {}
      if (contextUri) {
        body.context_uri = contextUri
        if (offset !== undefined) {
          body.offset = { position: offset }
        }
      }
      if (uri && !contextUri) {
        body.uris = [uri]
      }

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    },
    [deviceId, accessToken]
  )

  const pause = useCallback(async () => {
    await playerRef.current?.pause()
  }, [])

  const togglePlay = useCallback(async () => {
    await playerRef.current?.togglePlay()
  }, [])

  const next = useCallback(async () => {
    await playerRef.current?.nextTrack()
  }, [])

  const previous = useCallback(async () => {
    await playerRef.current?.previousTrack()
  }, [])

  const seek = useCallback(async (position: number) => {
    await playerRef.current?.seek(position)
  }, [])

  const setVolume = useCallback(async (volume: number) => {
    await playerRef.current?.setVolume(volume)
    setState(prev => ({ ...prev, volume }))
  }, [])

  const toggleShuffle = useCallback(async () => {
    if (!accessToken) return
    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!state.shuffle}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }, [accessToken, state.shuffle])

  const cycleRepeat = useCallback(async () => {
    if (!accessToken) return
    const nextMode = state.repeatMode === 'off' ? 'context' : state.repeatMode === 'context' ? 'track' : 'off'
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }, [accessToken, state.repeatMode])

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
