import styled from 'styled-components'
import { motion } from 'framer-motion'

interface LoginScreenProps {
  onLogin: () => void
  isSelected: boolean
}

export function LoginScreen({ onLogin, isSelected }: LoginScreenProps) {
  return (
    <Container>
      <Header>
        <HeaderTitle>iPod</HeaderTitle>
      </Header>

      <Content>
        <SpotifyLogo
          as={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🎵
        </SpotifyLogo>

        <WelcomeText>Welcome to iPod</WelcomeText>
        <SubText>Connect with Spotify to start</SubText>

        <LoginButton $selected={isSelected} onClick={onLogin}>
          Connect to Spotify
        </LoginButton>

        <HintText>Press the center button to connect</HintText>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #c9dbc9 0%, #a8c8a8 100%);
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  background: linear-gradient(180deg, #8a8a8a 0%, #6a6a6a 100%);
  border-bottom: 1px solid #555;
`

const HeaderTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 8px;
`

const SpotifyLogo = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
`

const WelcomeText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`

const SubText = styled.div`
  font-size: 11px;
  color: #444;
  margin-bottom: 12px;
`

const LoginButton = styled.button<{ $selected: boolean }>`
  padding: 8px 16px;
  background: ${props => (props.$selected ? '#2860D8' : '#1DB954')};
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`

const HintText = styled.div`
  font-size: 9px;
  color: #666;
  margin-top: 8px;
`
