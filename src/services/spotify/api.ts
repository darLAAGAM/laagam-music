import { SPOTIFY_CONFIG } from '../../constants/spotify'

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images?: SpotifyImage[]
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  artists: SpotifyArtist[]
}

export interface SpotifyTrack {
  id: string
  name: string
  uri: string
  duration_ms: number
  artists: SpotifyArtist[]
  album: SpotifyAlbum
}

export interface SpotifyPlaylist {
  id: string
  name: string
  images: SpotifyImage[]
  tracks: {
    total: number
  }
  uri: string
}

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
}

class SpotifyAPI {
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token set')
    }

    const response = await fetch(`${SPOTIFY_CONFIG.apiBaseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.fetch<SpotifyUser>('/me')
  }

  async getUserPlaylists(limit = 50): Promise<SpotifyPlaylist[]> {
    const response = await this.fetch<{ items: SpotifyPlaylist[] }>(`/me/playlists?limit=${limit}`)
    return response.items
  }

  async getPlaylistTracks(playlistId: string, limit = 100): Promise<SpotifyTrack[]> {
    const response = await this.fetch<{ items: { track: SpotifyTrack }[] }>(
      `/playlists/${playlistId}/tracks?limit=${limit}`
    )
    return response.items.map(item => item.track).filter(Boolean)
  }

  async getSavedTracks(limit = 50): Promise<SpotifyTrack[]> {
    const response = await this.fetch<{ items: { track: SpotifyTrack }[] }>(
      `/me/tracks?limit=${limit}`
    )
    return response.items.map(item => item.track)
  }

  async getTopArtists(limit = 50): Promise<SpotifyArtist[]> {
    const response = await this.fetch<{ items: SpotifyArtist[] }>(
      `/me/top/artists?limit=${limit}&time_range=medium_term`
    )
    return response.items
  }

  async getArtistTopTracks(artistId: string, market = 'US'): Promise<SpotifyTrack[]> {
    const response = await this.fetch<{ tracks: SpotifyTrack[] }>(
      `/artists/${artistId}/top-tracks?market=${market}`
    )
    return response.tracks
  }

  async getSavedAlbums(limit = 50): Promise<SpotifyAlbum[]> {
    const response = await this.fetch<{ items: { album: SpotifyAlbum }[] }>(
      `/me/albums?limit=${limit}`
    )
    return response.items.map(item => item.album)
  }

  async getAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
    const response = await this.fetch<{ items: SpotifyTrack[] }>(
      `/albums/${albumId}/tracks?limit=50`
    )
    return response.items
  }
}

export const spotifyAPI = new SpotifyAPI()
