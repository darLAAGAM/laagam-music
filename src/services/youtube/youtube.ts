export interface YouTubeContent {
  type: 'video' | 'playlist'
  id: string
  url: string
  title?: string
  thumbnailUrl?: string
}

export interface SavedYouTubeItem {
  id: string
  youtubeId: string
  type: 'video' | 'playlist'
  title: string
  thumbnailUrl?: string
  addedAt: number
}

/**
 * Parse YouTube URL and extract video/playlist ID
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
 */
export function parseYouTubeUrl(url: string): YouTubeContent | null {
  try {
    // Handle youtu.be short URLs
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
      if (match) {
        return {
          type: 'video',
          id: match[1],
          url: `https://www.youtube.com/watch?v=${match[1]}`,
          thumbnailUrl: `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`,
        }
      }
    }

    // Handle standard YouTube URLs
    const urlObj = new URL(url)

    // Check for playlist
    const listId = urlObj.searchParams.get('list')
    if (listId && !urlObj.searchParams.get('v')) {
      return {
        type: 'playlist',
        id: listId,
        url: `https://www.youtube.com/playlist?list=${listId}`,
        // Playlists don't have direct thumbnails, will be populated from oEmbed or first video
        thumbnailUrl: undefined,
      }
    }

    // Check for video (with or without playlist)
    const videoId = urlObj.searchParams.get('v')
    if (videoId) {
      return {
        type: 'video',
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      }
    }

    // Handle /embed/ URLs
    const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/)
    if (embedMatch) {
      return {
        type: 'video',
        id: embedMatch[1],
        url: `https://www.youtube.com/watch?v=${embedMatch[1]}`,
        thumbnailUrl: `https://img.youtube.com/vi/${embedMatch[1]}/mqdefault.jpg`,
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Fetch video info using oEmbed (no API key needed)
 */
export async function fetchYouTubeOEmbed(url: string): Promise<{
  title: string
  thumbnail_url: string
  author_name: string
} | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    )
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

const STORAGE_KEY = 'ipod_youtube_items'

// Default playlist to show when no items are saved
const DEFAULT_PLAYLIST: SavedYouTubeItem = {
  id: 'default-laagam-playlist',
  youtubeId: 'PLW_95a4He-o_Y-1S1UclpM-rxTnZ3maLF',
  type: 'playlist',
  title: 'LAAGAM Music',
  thumbnailUrl: undefined,
  addedAt: 0,
}

export function getSavedItems(): SavedYouTubeItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Return default playlist on first visit
      return [DEFAULT_PLAYLIST]
    }
    const items = JSON.parse(stored)
    // If items is empty array, also return default
    if (items.length === 0) {
      return [DEFAULT_PLAYLIST]
    }
    return items
  } catch {
    return [DEFAULT_PLAYLIST]
  }
}

export function saveItem(item: Omit<SavedYouTubeItem, 'id' | 'addedAt'>, forceUpdate = false): SavedYouTubeItem {
  const items = getSavedItems()

  // Check if already exists
  const existingIndex = items.findIndex(i => i.youtubeId === item.youtubeId)
  if (existingIndex !== -1) {
    if (forceUpdate) {
      // Update existing item with new metadata but keep id and addedAt
      const updated: SavedYouTubeItem = {
        ...items[existingIndex],
        title: item.title,
        thumbnailUrl: item.thumbnailUrl || items[existingIndex].thumbnailUrl,
      }
      items[existingIndex] = updated
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      return updated
    }
    return items[existingIndex]
  }

  const newItem: SavedYouTubeItem = {
    ...item,
    id: `yt-${Date.now()}`,
    addedAt: Date.now(),
  }

  items.unshift(newItem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newItem
}

export function removeItem(id: string): void {
  const items = getSavedItems()
  const filtered = items.filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearAllItems(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
