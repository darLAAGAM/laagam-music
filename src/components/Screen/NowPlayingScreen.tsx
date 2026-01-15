import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useYouTubePlayer } from '../../context/YouTubePlayerContext'
import { formatTime } from '../../services/youtube/youtube'

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
      <Container>
        <TitleBar>
          <TitleText>Now Playing</TitleText>
          <TitleRight>
            <TimeText>{timeString}</TimeText>
            <BatteryIcon>
              <BatteryBody><BatteryFill /></BatteryBody>
              <BatteryTip />
            </BatteryIcon>
          </TitleRight>
        </TitleBar>
        <NoTrack>
          <NoTrackText>Not Playing</NoTrackText>
        </NoTrack>
      </Container>
    )
  }

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0

  return (
    <Container>
      {/* Title bar with play indicator */}
      <TitleBar>
        <TitleLeft>
          <PlayIndicator>{isPlaying ? '▶' : '❚❚'}</PlayIndicator>
          <TrackNumber>1 of 1</TrackNumber>
        </TitleLeft>
        <TitleRight>
          <TimeText>{timeString}</TimeText>
          <BatteryIcon>
            <BatteryBody><BatteryFill /></BatteryBody>
            <BatteryTip />
          </BatteryIcon>
        </TitleRight>
      </TitleBar>

      <Content>
        {/* Album artwork */}
        <ArtworkContainer>
          {currentTrack.thumbnailUrl ? (
            <Artwork
              as={motion.img}
              src={currentTrack.thumbnailUrl}
              alt={currentTrack.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <ArtworkPlaceholder>
              <PlaceholderIcon>♫</PlaceholderIcon>
            </ArtworkPlaceholder>
          )}
        </ArtworkContainer>

        {/* Track info */}
        <TrackInfo>
          <SongTitle>{currentTrack.title}</SongTitle>
          <ArtistAlbum>{currentTrack.artist}</ArtistAlbum>
        </TrackInfo>

        {/* Progress bar - iPod 5G style with diamond scrubber */}
        <ProgressSection>
          <ProgressBar>
            <ProgressTrack />
            <ProgressFill style={{ width: `${progressPercent}%` }} />
            <ProgressDiamond style={{ left: `${progressPercent}%` }} />
          </ProgressBar>
          <TimeRow>
            <TimeElapsed>{formatTime(position)}</TimeElapsed>
            <TimeRemaining>-{formatTime(Math.max(0, duration - position))}</TimeRemaining>
          </TimeRow>
        </ProgressSection>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(180deg, #b8b8b8 0%, #9a9a9a 50%, #8a8a8a 100%);
  min-height: 18px;
  border-bottom: 1px solid #6a6a6a;
`

const TitleText = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #000;
`

const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const PlayIndicator = styled.span`
  font-size: 9px;
  color: #000;
`

const TrackNumber = styled.span`
  font-size: 10px;
  color: #000;
`

const TitleRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const TimeText = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: #000;
`

const BatteryIcon = styled.div`
  display: flex;
  align-items: center;
`

const BatteryBody = styled.div`
  width: 16px;
  height: 8px;
  border: 1px solid #000;
  border-radius: 1px;
  padding: 1px;
  background: #fff;
`

const BatteryFill = styled.div`
  width: 100%;
  height: 100%;
  background: #4cd964;
  border-radius: 0.5px;
`

const BatteryTip = styled.div`
  width: 2px;
  height: 4px;
  background: #000;
  border-radius: 0 1px 1px 0;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 12px 8px;
`

const ArtworkContainer = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 6px;
`

const Artwork = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`

const ArtworkPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PlaceholderIcon = styled.span`
  font-size: 32px;
  color: #888;
`

const TrackInfo = styled.div`
  text-align: center;
  width: 100%;
  margin-bottom: 8px;
`

const SongTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`

const ArtistAlbum = styled.div`
  font-size: 10px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ProgressSection = styled.div`
  width: 100%;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  position: relative;
  display: flex;
  align-items: center;
`

const ProgressTrack = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: #d0d0d0;
  border-radius: 1.5px;
`

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  height: 3px;
  background: #808080;
  border-radius: 1.5px;
  transition: width 0.1s linear;
`

const ProgressDiamond = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #4a4a4a;
  transform: translateX(-50%) rotate(45deg);
  transition: left 0.1s linear;
`

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
`

const TimeElapsed = styled.span`
  font-size: 9px;
  color: #000;
`

const TimeRemaining = styled.span`
  font-size: 9px;
  color: #000;
`

const NoTrack = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NoTrackText = styled.div`
  font-size: 12px;
  color: #666;
`
