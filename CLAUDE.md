# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite) at http://127.0.0.1:5173
npm run build    # Type-check with tsc and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture Overview

This is a React + TypeScript web app that emulates an iPod Classic music player using YouTube's IFrame API for audio playback. It requires no API keys or authentication.

### Core Data Flow

```
App.tsx
  └── YouTubePlayerProvider (context/YouTubePlayerContext.tsx)
        └── NavigationProvider (context/NavigationContext.tsx)
              └── iPodPlayer
                    ├── iPodShell → iPodScreen → ScreenContainer
                    └── ClickWheel
```

### Context Providers

**YouTubePlayerContext** manages YouTube IFrame API:
- Creates hidden YouTube player (200x150px, visibility:hidden)
- Exposes: `loadVideo()`, `loadPlaylist()`, `togglePlay()`, `nextTrack()`, `previousTrack()`, `adjustVolume()`
- Tracks: `isReady`, `isPlaying`, `currentTrack`, `position`, `duration`, `volume`

**NavigationContext** is the central state manager using `useReducer`:
- `menuStack`: Array of menu IDs for back navigation
- `screenType`: Controls which screen renders (`'menu' | 'nowPlaying' | 'addPlaylist'`)
- `videos`: User's saved YouTube content (persisted to localStorage key `'ipod_youtube_items'`)
- `currentVideo`: Currently playing video/playlist with `timestamp` for forcing reloads

### Click Wheel Implementation

The Click Wheel (`components/ClickWheel/`) detects circular mouse/touch gestures:
1. `useWheelRotation` hook tracks pointer position relative to wheel center
2. `utils/angleCalculation.ts` computes angle deltas between positions
3. When accumulated rotation exceeds `sensitivity` threshold (degrees), it emits scroll events
4. Clockwise = scroll down, Counter-clockwise = scroll up

### YouTube Integration

No API keys needed. Uses YouTube's public systems (`services/youtube/youtube.ts`):
- `parseYouTubeUrl()`: Extracts type and ID from YouTube URLs (videos, playlists, youtu.be short links)
- `fetchYouTubeOEmbed()`: Gets metadata (title, thumbnail) from YouTube's oEmbed endpoint
- `getSavedItems()`, `saveItem()`, `removeItem()`: localStorage persistence

### Screen System

`ScreenContainer` uses Framer Motion's `AnimatePresence` for slide transitions based on `state.direction` ('forward' | 'back'). Three screen types:
- `MenuScreen`: Scrollable list with blue selection highlight
- `NowPlayingScreen`: Shows current track info, progress bar, play/pause state
- `AddPlaylistScreen`: URL input form for adding YouTube videos/playlists

### Styling

- **styled-components** for all CSS
- Theme values in `styles/theme.ts` (iPod dimensions, colors for 'silver'/'black' variants)
- LCD screen effect via CSS linear-gradient overlays
