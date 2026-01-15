import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect, useRef } from 'react'
import {
  parseYouTubeUrl,
  fetchYouTubeOEmbed,
  getSavedItems,
  saveItem,
  removeItem,
  SavedYouTubeItem,
} from '../services/youtube/youtube'

export type ScreenType = 'menu' | 'nowPlaying' | 'addPlaylist'

interface MenuItem {
  id: string
  label: string
  type: 'navigation' | 'action' | 'video'
  target?: string
  youtubeId?: string
  contentType?: 'video' | 'playlist'
  thumbnailUrl?: string
  subtitle?: string
}

interface MenuDefinition {
  id: string
  title: string
  items: MenuItem[]
  parent?: string
}

interface NavigationState {
  menuStack: string[]
  currentMenuId: string
  selectedIndex: number
  direction: 'forward' | 'back'
  screenType: ScreenType
  currentVideo: { youtubeId: string; title: string; contentType: 'video' | 'playlist'; timestamp: number } | null
  videos: SavedYouTubeItem[]
  addPlaylistError: string | null
  isAddingVideo: boolean
}

type NavigationAction =
  | { type: 'NAVIGATE_TO'; menuId: string }
  | { type: 'GO_BACK' }
  | { type: 'SCROLL_UP' }
  | { type: 'SCROLL_DOWN'; maxIndex: number }
  | { type: 'PLAY_VIDEO'; youtubeId: string; title: string; contentType: 'video' | 'playlist' }
  | { type: 'SHOW_ADD_PLAYLIST' }
  | { type: 'SET_VIDEOS'; videos: SavedYouTubeItem[] }
  | { type: 'SET_ADD_PLAYLIST_ERROR'; error: string | null }
  | { type: 'RESET_TO_MENU' }
  | { type: 'SET_ADDING_VIDEO'; isAdding: boolean }

const initialState: NavigationState = {
  menuStack: ['main'],
  currentMenuId: 'main',
  selectedIndex: 0,
  direction: 'forward',
  screenType: 'menu',
  currentVideo: null,
  videos: [],
  addPlaylistError: null,
  isAddingVideo: false,
}

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        ...state,
        menuStack: [...state.menuStack, action.menuId],
        currentMenuId: action.menuId,
        selectedIndex: 0,
        direction: 'forward',
        screenType: 'menu',
      }

    case 'GO_BACK':
      if (state.screenType === 'nowPlaying' || state.screenType === 'addPlaylist') {
        return {
          ...state,
          screenType: 'menu',
          direction: 'back',
          addPlaylistError: null,
        }
      }
      if (state.menuStack.length <= 1) return state

      const newStack = state.menuStack.slice(0, -1)
      return {
        ...state,
        menuStack: newStack,
        currentMenuId: newStack[newStack.length - 1],
        selectedIndex: 0,
        direction: 'back',
      }

    case 'SCROLL_UP':
      return {
        ...state,
        selectedIndex: Math.max(0, state.selectedIndex - 1),
      }

    case 'SCROLL_DOWN':
      return {
        ...state,
        selectedIndex: Math.min(action.maxIndex, state.selectedIndex + 1),
      }

    case 'PLAY_VIDEO':
      return {
        ...state,
        screenType: 'nowPlaying',
        direction: 'forward',
        currentVideo: { youtubeId: action.youtubeId, title: action.title, contentType: action.contentType, timestamp: Date.now() },
      }

    case 'SHOW_ADD_PLAYLIST':
      return {
        ...state,
        screenType: 'addPlaylist',
        direction: 'forward',
        addPlaylistError: null,
      }

    case 'SET_VIDEOS':
      return {
        ...state,
        videos: action.videos,
      }

    case 'SET_ADD_PLAYLIST_ERROR':
      return {
        ...state,
        addPlaylistError: action.error,
      }

    case 'RESET_TO_MENU':
      return {
        ...state,
        screenType: 'menu',
        addPlaylistError: null,
      }

    case 'SET_ADDING_VIDEO':
      return {
        ...state,
        isAddingVideo: action.isAdding,
      }

    default:
      return state
  }
}

const MENU_STRUCTURE: Record<string, MenuDefinition> = {
  main: {
    id: 'main',
    title: 'iPod',
    items: [
      { id: 'music', label: 'Music', type: 'navigation', target: 'music' },
      { id: 'photos', label: 'Photos', type: 'navigation', target: 'photos' },
      { id: 'videos', label: 'Videos', type: 'navigation', target: 'videos' },
      { id: 'extras', label: 'Extras', type: 'navigation', target: 'extras' },
      { id: 'settings', label: 'Settings', type: 'navigation', target: 'settings' },
      { id: 'shuffle', label: 'Shuffle Songs', type: 'action' },
      { id: 'now-playing', label: 'Now Playing', type: 'action', target: 'nowPlaying' },
    ],
  },
  photos: {
    id: 'photos',
    title: 'Photos',
    parent: 'main',
    items: [
      { id: 'photo-library', label: 'Photo Library', type: 'action' },
    ],
  },
  videos: {
    id: 'videos',
    title: 'Videos',
    parent: 'main',
    items: [
      { id: 'video-playlists', label: 'Video Playlists', type: 'action' },
    ],
  },
  extras: {
    id: 'extras',
    title: 'Extras',
    parent: 'main',
    items: [
      { id: 'add-new', label: 'Add YouTube URL', type: 'action', target: 'addPlaylist' },
      { id: 'clock', label: 'Clock', type: 'action' },
      { id: 'games', label: 'Games', type: 'action' },
      { id: 'contacts', label: 'Contacts', type: 'action' },
      { id: 'calendar', label: 'Calendar', type: 'action' },
      { id: 'notes', label: 'Notes', type: 'action' },
    ],
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    parent: 'main',
    items: [
      { id: 'about', label: 'About', type: 'navigation', target: 'about' },
      { id: 'shuffle-setting', label: 'Shuffle', type: 'action', subtitle: 'Off' },
      { id: 'repeat', label: 'Repeat', type: 'action', subtitle: 'Off' },
      { id: 'eq', label: 'EQ', type: 'action', subtitle: 'Off' },
      { id: 'backlight', label: 'Backlight', type: 'action', subtitle: '10 Seconds' },
      { id: 'brightness', label: 'Brightness', type: 'action' },
    ],
  },
  about: {
    id: 'about',
    title: 'About',
    parent: 'settings',
    items: [
      { id: 'name', label: 'Diego\'s iPod', type: 'action' },
      { id: 'songs', label: 'Songs', type: 'action', subtitle: '0' },
      { id: 'videos-count', label: 'Videos', type: 'action', subtitle: '0' },
      { id: 'photos-count', label: 'Photos', type: 'action', subtitle: '0' },
      { id: 'capacity', label: 'Capacity', type: 'action', subtitle: '80 GB' },
      { id: 'available', label: 'Available', type: 'action', subtitle: '74.2 GB' },
      { id: 'version', label: 'Version', type: 'action', subtitle: '1.3' },
      { id: 'serial', label: 'Serial Number', type: 'action' },
    ],
  },
}

interface NavigationContextType {
  state: NavigationState
  currentMenu: MenuDefinition | null
  navigateTo: (menuId: string) => void
  goBack: () => void
  scrollUp: () => void
  scrollDown: () => void
  selectItem: (item: MenuItem) => void
  showAddPlaylist: () => void
  addVideo: (url: string) => Promise<boolean>
  deleteVideo: (id: string) => void
  playVideo: (youtubeId: string, title: string, contentType: 'video' | 'playlist') => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialState)
  const isAddingVideoRef = useRef(false)

  // Load saved videos on mount
  useEffect(() => {
    const videos = getSavedItems()
    dispatch({ type: 'SET_VIDEOS', videos })
  }, [])

  // Build current menu dynamically
  const currentMenu: MenuDefinition | null = (() => {
    if (state.currentMenuId === 'music') {
      return {
        id: 'music',
        title: 'Music',
        parent: 'main',
        items: state.videos.length > 0
          ? state.videos.map(v => ({
              id: v.id,
              label: v.title,
              type: 'video' as const,
              youtubeId: v.youtubeId,
              contentType: v.type,
              thumbnailUrl: v.thumbnailUrl,
              subtitle: v.type,
            }))
          : [{ id: 'empty', label: 'No music yet', type: 'action' as const }],
      }
    }
    return MENU_STRUCTURE[state.currentMenuId] || null
  })()

  const navigateTo = useCallback((menuId: string) => {
    dispatch({ type: 'NAVIGATE_TO', menuId })
  }, [])

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' })
  }, [])

  const scrollUp = useCallback(() => {
    dispatch({ type: 'SCROLL_UP' })
  }, [])

  const scrollDown = useCallback(() => {
    if (currentMenu) {
      dispatch({ type: 'SCROLL_DOWN', maxIndex: Math.max(0, currentMenu.items.length - 1) })
    }
  }, [currentMenu])

  const showAddPlaylist = useCallback(() => {
    dispatch({ type: 'SHOW_ADD_PLAYLIST' })
  }, [])

  const addVideo = useCallback(async (url: string): Promise<boolean> => {
    // Prevent multiple simultaneous calls using ref (synchronous check)
    if (isAddingVideoRef.current) {
      console.log('addVideo - already adding, skipping')
      return false
    }

    isAddingVideoRef.current = true
    dispatch({ type: 'SET_ADD_PLAYLIST_ERROR', error: null })

    const parsed = parseYouTubeUrl(url)
    console.log('addVideo - parsed URL:', parsed)
    if (!parsed) {
      dispatch({ type: 'SET_ADD_PLAYLIST_ERROR', error: 'Invalid YouTube URL' })
      isAddingVideoRef.current = false
      return false
    }

    try {
      const oEmbed = await fetchYouTubeOEmbed(parsed.url)
      const title = oEmbed?.title || `Video - ${parsed.id.slice(0, 8)}`
      const thumbnailUrl = parsed.thumbnailUrl || oEmbed?.thumbnail_url
      console.log('addVideo - oEmbed result:', { title, thumbnailUrl })

      const saved = saveItem({
        youtubeId: parsed.id,
        type: parsed.type,
        title,
        thumbnailUrl,
      })
      console.log('addVideo - saved item:', saved)

      const videos = getSavedItems()
      dispatch({ type: 'SET_VIDEOS', videos })

      // Play the new video
      console.log('addVideo - dispatching PLAY_VIDEO:', { youtubeId: saved.youtubeId, title: saved.title, contentType: saved.type })
      dispatch({ type: 'PLAY_VIDEO', youtubeId: saved.youtubeId, title: saved.title, contentType: saved.type })
      isAddingVideoRef.current = false

      return true
    } catch (error) {
      console.error('addVideo - error:', error)
      dispatch({ type: 'SET_ADD_PLAYLIST_ERROR', error: 'Failed to add video' })
      isAddingVideoRef.current = false
      return false
    }
  }, [])

  const deleteVideo = useCallback((id: string) => {
    removeItem(id)
    const videos = getSavedItems()
    dispatch({ type: 'SET_VIDEOS', videos })
  }, [])

  const playVideo = useCallback((youtubeId: string, title: string, contentType: 'video' | 'playlist') => {
    dispatch({ type: 'PLAY_VIDEO', youtubeId, title, contentType })
  }, [])

  const selectItem = useCallback(
    (item: MenuItem) => {
      switch (item.type) {
        case 'navigation':
          if (item.target) {
            navigateTo(item.target)
          }
          break
        case 'video':
          if (item.youtubeId) {
            playVideo(item.youtubeId, item.label, item.contentType || 'video')
          }
          break
        case 'action':
          if (item.target === 'addPlaylist') {
            showAddPlaylist()
          } else if (item.target === 'nowPlaying' && state.currentVideo) {
            dispatch({
              type: 'PLAY_VIDEO',
              youtubeId: state.currentVideo.youtubeId,
              title: state.currentVideo.title,
              contentType: state.currentVideo.contentType,
            })
          }
          break
      }
    },
    [navigateTo, showAddPlaylist, playVideo, state.currentVideo]
  )

  return (
    <NavigationContext.Provider
      value={{
        state,
        currentMenu,
        navigateTo,
        goBack,
        scrollUp,
        scrollDown,
        selectItem,
        showAddPlaylist,
        addVideo,
        deleteVideo,
        playVideo,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}
