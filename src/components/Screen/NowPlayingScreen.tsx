import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useYouTubePlayer } from '../../context/YouTubePlayerContext'
import { formatTime } from '../../services/youtube/youtube'
import './Screen.css'

export function NowPlayingScreen() {
  const { currentTrack, isPlaying, position, duration } = useYouTubePlayer()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  if (!currentTrack) {
    return (
      <div className="now-playing-screen">
        <div className="ipod-title-bar">
          <span className="ipod-title-text">Now Playing</span>
          <div className="ipod-title-right">
            <span className="ipod-time-text">{timeString}</span>
            <div className="ipod-battery-icon">
              <div className="ipod-battery-body"><div className="ipod-battery-fill" /></div>
              <div className="ipod-battery-tip" />
            </div>
          </div>
        </div>
        <div className="now-playing-no-track">
          <div className="now-playing-no-track-text">Not Playing</div>
        </div>
      </div>
    )
  }

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0

  return (
    <div className="now-playing-screen">
      {/* Title bar with play indicator */}
      <div className="ipod-title-bar">
        <div className="ipod-title-left">
          <span className="now-playing-indicator">{isPlaying ? '▶' : '❚❚'}</span>
          <span className="now-playing-track-number">1 of 1</span>
        </div>
        <div className="ipod-title-right">
          <span className="ipod-time-text">{timeString}</span>
          <div className="ipod-battery-icon">
            <div className="ipod-battery-body"><div className="ipod-battery-fill" /></div>
            <div className="ipod-battery-tip" />
          </div>
        </div>
      </div>

      <div className="now-playing-content">
        {/* Album artwork */}
        <div className="now-playing-artwork-container">
          {currentTrack.thumbnailUrl ? (
            <motion.img
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              className="now-playing-artwork"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <div className="now-playing-artwork-placeholder">
              <span className="now-playing-placeholder-icon">♫</span>
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="now-playing-track-info">
          <div className="now-playing-song-title">{currentTrack.title}</div>
          <div className="now-playing-artist">{currentTrack.artist}</div>
        </div>

        {/* Progress bar - iPod 5G style with diamond scrubber */}
        <div className="now-playing-progress-section">
          <div className="now-playing-progress-bar">
            <div className="now-playing-progress-track" />
            <div className="now-playing-progress-fill" style={{ width: `${progressPercent}%` }} />
            <div className="now-playing-progress-diamond" style={{ left: `${progressPercent}%` }} />
          </div>
          <div className="now-playing-time-row">
            <span className="now-playing-time">{formatTime(position)}</span>
            <span className="now-playing-time">-{formatTime(Math.max(0, duration - position))}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
