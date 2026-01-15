export interface MenuItem {
  id: string
  label: string
  type: 'navigation' | 'action' | 'player' | 'track' | 'playlist'
  target?: string
  action?: string
  uri?: string
  imageUrl?: string
  subtitle?: string
}

export interface MenuDefinition {
  id: string
  title: string
  items: MenuItem[]
  parent?: string
}

export const MENU_STRUCTURE: Record<string, MenuDefinition> = {
  main: {
    id: 'main',
    title: 'iPod',
    items: [
      { id: 'music', label: 'Music', type: 'navigation', target: 'music' },
      { id: 'playlists', label: 'Playlists', type: 'navigation', target: 'playlists' },
      { id: 'now-playing', label: 'Now Playing', type: 'player' },
      { id: 'shuffle', label: 'Shuffle Songs', type: 'action', action: 'shuffle' },
      { id: 'settings', label: 'Settings', type: 'navigation', target: 'settings' },
    ],
  },

  music: {
    id: 'music',
    title: 'Music',
    parent: 'main',
    items: [
      { id: 'playlists-music', label: 'Playlists', type: 'navigation', target: 'playlists' },
      { id: 'artists', label: 'Artists', type: 'navigation', target: 'artists' },
      { id: 'albums', label: 'Albums', type: 'navigation', target: 'albums' },
      { id: 'songs', label: 'Songs', type: 'navigation', target: 'songs' },
    ],
  },

  settings: {
    id: 'settings',
    title: 'Settings',
    parent: 'main',
    items: [
      { id: 'about', label: 'About', type: 'navigation', target: 'about' },
      { id: 'logout', label: 'Sign Out', type: 'action', action: 'logout' },
    ],
  },

  about: {
    id: 'about',
    title: 'About',
    parent: 'settings',
    items: [
      { id: 'version', label: 'Version 1.0.0', type: 'action' },
      { id: 'developer', label: 'Made with React', type: 'action' },
    ],
  },

  playlists: {
    id: 'playlists',
    title: 'Playlists',
    parent: 'main',
    items: [],
  },

  artists: {
    id: 'artists',
    title: 'Artists',
    parent: 'music',
    items: [],
  },

  albums: {
    id: 'albums',
    title: 'Albums',
    parent: 'music',
    items: [],
  },

  songs: {
    id: 'songs',
    title: 'Songs',
    parent: 'music',
    items: [],
  },
}
