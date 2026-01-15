import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

interface SpotifyEmbedProps {
  embedUrl: string
  title?: string
}

function extractSpotifyUrl(embedUrl: string): string {
  // Convert embed URL to regular Spotify URL
  // From: https://open.spotify.com/embed/playlist/xxx?...
  // To: https://open.spotify.com/playlist/xxx
  const match = embedUrl.match(/embed\/(playlist|album|track|artist)\/([^?]+)/)
  if (match) {
    return `https://open.spotify.com/${match[1]}/${match[2]}`
  }
  return embedUrl
}

export function SpotifyEmbed({ embedUrl, title }: SpotifyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Ensure autoplay is always enabled
  const finalEmbedUrl = useMemo(() => {
    const url = embedUrl.includes('autoplay=1')
      ? embedUrl
      : `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    return url
  }, [embedUrl])

  const spotifyUrl = useMemo(() => extractSpotifyUrl(embedUrl), [embedUrl])

  useEffect(() => {
    setIsLoading(true)
  }, [finalEmbedUrl])

  const handleOpenInSpotify = () => {
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>{title || 'Now Playing'}</HeaderTitle>
        <OpenButton onClick={handleOpenInSpotify} title="Open in Spotify">
          ↗
        </OpenButton>
      </Header>

      <EmbedContainer>
        {isLoading && (
          <LoadingOverlay
            as={motion.div}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner>🎵</LoadingSpinner>
            <LoadingText>Loading...</LoadingText>
          </LoadingOverlay>
        )}

        <StyledIframe
          src={finalEmbedUrl}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          $isLoading={isLoading}
        />
      </EmbedContainer>

      <HintBar>
        <HintText>Click inside player or ↗ to open Spotify</HintText>
      </HintBar>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #191414 0%, #121212 100%);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: linear-gradient(180deg, #282828 0%, #1a1a1a 100%);
  border-bottom: 1px solid #000;
`

const HeaderTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

const OpenButton = styled.button`
  background: #1db954;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background: #1ed760;
  }

  &:active {
    background: #169c46;
  }
`

const EmbedContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

const StyledIframe = styled.iframe<{ $isLoading: boolean }>`
  width: 100%;
  height: 100%;
  border: none;
  opacity: ${props => (props.$isLoading ? 0 : 1)};
  transition: opacity 0.3s ease;
  position: relative;
  z-index: 1;
  pointer-events: auto;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #121212;
`

const LoadingSpinner = styled.div`
  font-size: 32px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
  }
`

const LoadingText = styled.div`
  font-size: 12px;
  color: #b3b3b3;
`

const HintBar = styled.div`
  padding: 4px;
  background: #282828;
  border-top: 1px solid #000;
`

const HintText = styled.div`
  font-size: 9px;
  color: #727272;
  text-align: center;
`
