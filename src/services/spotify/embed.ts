export interface SpotifyContent {
  type: 'playlist' | 'album' | 'track' | 'artist'
  id: string
  url: string
  embedUrl: string
  name?: string
  description?: string
  thumbnailUrl?: string
}

export function parseSpotifyUrl(url: string): SpotifyContent | null {
  try {
    // Handle both open.spotify.com and spotify: URI formats
    // Examples:
    // https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
    // https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv
    // https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
    // spotify:playlist:37i9dQZF1DXcBWIGoYBM5M

    let type: SpotifyContent['type'] | null = null
    let id: string | null = null

    if (url.includes('open.spotify.com')) {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/').filter(Boolean)

      if (pathParts.length >= 2) {
        const possibleType = pathParts[0] as SpotifyContent['type']
        if (['playlist', 'album', 'track', 'artist'].includes(possibleType)) {
          type = possibleType
          // Remove any query params from the ID
          id = pathParts[1].split('?')[0]
        }
      }
    } else if (url.startsWith('spotify:')) {
      const parts = url.split(':')
      if (parts.length >= 3) {
        const possibleType = parts[1] as SpotifyContent['type']
        if (['playlist', 'album', 'track', 'artist'].includes(possibleType)) {
          type = possibleType
          id = parts[2]
        }
      }
    }

    if (!type || !id) {
      return null
    }

    return {
      type,
      id,
      url: `https://open.spotify.com/${type}/${id}`,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0&autoplay=1`,
    }
  } catch {
    return null
  }
}

export async function fetchSpotifyOEmbed(url: string): Promise<{
  title: string
  thumbnail_url: string
  html: string
} | null> {
  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    )
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export interface SavedPlaylist {
  id: string
  name: string
  type: SpotifyContent['type']
  spotifyId: string
  embedUrl: string
  thumbnailUrl?: string
  addedAt: number
}

const STORAGE_KEY = 'ipod_playlists'

export function getSavedPlaylists(): SavedPlaylist[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function savePlaylist(playlist: Omit<SavedPlaylist, 'id' | 'addedAt'>): SavedPlaylist {
  const playlists = getSavedPlaylists()

  // Check if already exists
  const existing = playlists.find(p => p.spotifyId === playlist.spotifyId)
  if (existing) return existing

  const newPlaylist: SavedPlaylist = {
    ...playlist,
    id: `playlist-${Date.now()}`,
    addedAt: Date.now(),
  }

  playlists.unshift(newPlaylist)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists))
  return newPlaylist
}

export function removePlaylist(id: string): void {
  const playlists = getSavedPlaylists()
  const filtered = playlists.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearAllPlaylists(): void {
  localStorage.removeItem(STORAGE_KEY)
}
