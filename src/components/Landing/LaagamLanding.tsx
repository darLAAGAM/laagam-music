import styled, { keyframes, css } from 'styled-components'
import { ReactNode, useEffect, useState } from 'react'
import LogoWordmark from '../../assets/LAAGAM ASSETS LOGOS-01 WHITE.png'
import LogoCombined from '../../assets/LAAGAM ASSETS LOGOS-03 WHITE.png'
import LaagamVideo from '../../../Video/SnapInsta.to_AQP_XDfE3y7thGZu9NR8KoEDnjUj5Zk8vQIDvU2yyXy3de8kRYTCLd7gRPnDlE717FCQIoAtjcuaAcUDdgJHNURewvqZ0lS6DeSNWYA.mp4'

interface LaagamLandingProps {
  children: ReactNode
}

export function LaagamLanding({ children }: LaagamLandingProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <PageContainer>
      {/* Fixed Header */}
      <Header $visible={isLoaded}>
        <LogoLink href="https://laagam.com">
          <Logo src={LogoWordmark} alt="LAAGAM" />
        </LogoLink>
        <Nav>
          <NavLink href="https://laagam.com">Shop</NavLink>
        </Nav>
      </Header>

      {/* Hero Section */}
      <Hero>
        <HeroInner $visible={isLoaded}>
          {/* Video */}
          <VideoWrapper>
            <Video
              src={LaagamVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </VideoWrapper>

          {/* Text Content */}
          <HeroText>
            <Title>
              <span>The</span>
              <TitleAccent>Sound</TitleAccent>
              <span>of</span>
              <TitleAccent>Style</TitleAccent>
            </Title>
            <Subtitle>
              Curated playlists that embody our vision of contemporary fashion.
            </Subtitle>
            <CTAButton href="#player" onClick={(e) => { e.preventDefault(); document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Explore LAAGAM Music
            </CTAButton>
          </HeroText>
        </HeroInner>
      </Hero>

      {/* iPod Player */}
      <PlayerSection id="player">
        <PlayerWrapper>
          {children}
          <PlayerHint>Spin the wheel to navigate</PlayerHint>
        </PlayerWrapper>
      </PlayerSection>

      {/* How It Works */}
      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <Steps>
          <Step>
            <StepNumber>01</StepNumber>
            <StepTitle>Add your music</StepTitle>
            <StepDesc>Paste any YouTube URL or playlist</StepDesc>
          </Step>
          <Step>
            <StepNumber>02</StepNumber>
            <StepTitle>Classic interface</StepTitle>
            <StepDesc>Experience the iconic click wheel</StepDesc>
          </Step>
          <Step>
            <StepNumber>03</StepNumber>
            <StepTitle>Express yourself</StepTitle>
            <StepDesc>Create playlists that reflect your style</StepDesc>
          </Step>
        </Steps>
      </Section>

      {/* Brand Statement */}
      <Statement>
        <StatementText>
          LAAGAM is an independent ready-to-wear fashion brand for{' '}
          <em>women in control.</em>
        </StatementText>
        <StatementMeta>
          <MetaItem>
            <MetaLabel>Mission</MetaLabel>
            <MetaValue>Contemporary self-expression</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Origin</MetaLabel>
            <MetaValue>Barcelona, Spain</MetaValue>
          </MetaItem>
        </StatementMeta>
      </Statement>

      {/* Press */}
      <Section>
        <SectionTitle>In The Press</SectionTitle>
        <Press>
          <PressItem>
            <PressName>VOGUE</PressName>
            <PressQuote>"Will define the future of fashion"</PressQuote>
          </PressItem>
          <PressItem>
            <PressName>Forbes</PressName>
            <PressQuote>"30 under 30 Europe"</PressQuote>
          </PressItem>
          <PressItem>
            <PressName>WIRED</PressName>
            <PressQuote>"One of Europe's hottest startups"</PressQuote>
          </PressItem>
          <PressItem>
            <PressName>hypebae</PressName>
            <PressQuote>"Have entered a whole new world"</PressQuote>
          </PressItem>
        </Press>
      </Section>

      {/* Footer */}
      <Footer>
        <FooterMain>
          <FooterBrand>
            <FooterLogo src={LogoCombined} alt="LAAGAM" />
          </FooterBrand>
          <FooterNav>
            <FooterCol>
              <FooterColTitle>Shop</FooterColTitle>
              <FooterLink href="https://laagam.com/collections/new-in">New In</FooterLink>
              <FooterLink href="https://laagam.com/collections/all">All</FooterLink>
              <FooterLink href="https://laagam.com/collections/bestsellers">Bestsellers</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterColTitle>Info</FooterColTitle>
              <FooterLink href="https://laagam.com/pages/about">About</FooterLink>
              <FooterLink href="https://laagam.com/pages/contact">Contact</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterColTitle>Social</FooterColTitle>
              <FooterLink href="https://www.instagram.com/laagam/">Instagram</FooterLink>
              <FooterLink href="https://www.tiktok.com/@laagam">TikTok</FooterLink>
            </FooterCol>
          </FooterNav>
        </FooterMain>
        <FooterBottom>
          <span>© 2025 LAAGAM</span>
          <span>LAAGAM.COM</span>
        </FooterBottom>
      </Footer>
    </PageContainer>
  )
}

// ============================================
// ANIMATIONS
// ============================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

// ============================================
// BASE STYLES
// ============================================

const PageContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
`

// ============================================
// HEADER - Mobile First
// ============================================

const Header = styled.header<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%);
  opacity: ${p => p.$visible ? 1 : 0};
  transition: opacity 0.5s ease;

  @media (min-width: 768px) {
    padding: 24px 40px;
  }
`

const LogoLink = styled.a`
  display: block;
`

const Logo = styled.img`
  height: 24px;
  width: auto;
  display: block;

  @media (min-width: 768px) {
    height: 32px;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 32px;
  }
`

const NavLink = styled.a`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  text-decoration: none;

  @media (min-width: 768px) {
    font-size: 13px;
    letter-spacing: 1.5px;
  }
`

// ============================================
// HERO - Mobile First
// ============================================

const Hero = styled.section`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 140px 20px 40px;

  @media (min-width: 768px) {
    padding: 160px 40px 60px;
  }
`

const HeroInner = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};

  @media (min-width: 900px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 60px;
  }
`

// ============================================
// VIDEO - Mobile First
// ============================================

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 350px;

  @media (min-width: 768px) {
    max-width: 400px;
  }
`

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
`

// ============================================
// PLAYER SECTION - Mobile First
// ============================================

const PlayerSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;

  @media (min-width: 768px) {
    padding: 80px 40px;
  }
`

// ============================================
// PLAYER WRAPPER - Mobile First
// ============================================

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transform: scale(0.8);
  transform-origin: center center;

  @media (min-width: 400px) {
    transform: scale(0.9);
  }

  @media (min-width: 768px) {
    transform: scale(1);
    gap: 20px;
  }
`

const PlayerHint = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  text-align: center;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`

// ============================================
// HERO TEXT - Mobile First
// ============================================

const HeroText = styled.div`
  text-align: center;
  max-width: 500px;

  @media (min-width: 900px) {
    text-align: left;
    max-width: 480px;
  }
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 300;
  line-height: 1.15;
  margin: 0 0 20px 0;
  letter-spacing: -1px;

  span {
    display: inline;
  }

  @media (min-width: 768px) {
    font-size: 52px;
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    font-size: 64px;
  }
`

const TitleAccent = styled.span`
  font-style: italic;
  font-weight: 500;
`

const Subtitle = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255,255,255,0.6);
  margin: 0 0 28px 0;

  @media (min-width: 768px) {
    font-size: 17px;
    line-height: 1.7;
    margin-bottom: 32px;
  }
`

const CTAButton = styled.a`
  display: inline-block;
  padding: 14px 32px;
  background: #fff;
  color: #000;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    padding: 16px 40px;
    font-size: 13px;

    &:hover {
      background: rgba(255,255,255,0.9);
      transform: translateY(-2px);
    }
  }
`

// ============================================
// SECTIONS - Mobile First
// ============================================

const Section = styled.section`
  padding: 60px 20px;

  @media (min-width: 768px) {
    padding: 100px 40px;
  }
`

const SectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.4);
  margin: 0 0 32px 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 12px;
    margin-bottom: 48px;
  }
`

// ============================================
// STEPS - Mobile First
// ============================================

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 40px;
  }
`

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.1);

  @media (min-width: 768px) {
    padding: 40px 32px;
  }
`

const StepNumber = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16px;
  letter-spacing: 2px;
`

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 12px 0;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`

const StepDesc = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin: 0;
  line-height: 1.5;
`

// ============================================
// STATEMENT - Mobile First
// ============================================

const Statement = styled.section`
  padding: 60px 20px;
  text-align: center;
  background: rgba(255,255,255,0.02);

  @media (min-width: 768px) {
    padding: 100px 40px;
  }
`

const StatementText = styled.p`
  font-size: 22px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 700px;
  margin: 0 auto 40px;

  em {
    font-style: italic;
    font-weight: 500;
  }

  @media (min-width: 768px) {
    font-size: 32px;
    margin-bottom: 48px;
  }
`

const StatementMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 60px;
  }
`

const MetaItem = styled.div`
  text-align: center;
`

const MetaLabel = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
  margin-bottom: 8px;
`

const MetaValue = styled.span`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
`

// ============================================
// PRESS - Mobile First
// ============================================

const Press = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`

const PressItem = styled.div`
  padding: 24px 16px;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;

  @media (min-width: 768px) {
    padding: 32px 20px;
  }
`

const PressName = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 12px;
  }
`

const PressQuote = styled.p`
  font-size: 11px;
  font-style: italic;
  color: rgba(255,255,255,0.4);
  margin: 0;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 12px;
  }
`

// ============================================
// FOOTER - Mobile First
// ============================================

const Footer = styled.footer`
  border-top: 1px solid rgba(255,255,255,0.1);
`

const FooterMain = styled.div`
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (min-width: 768px) {
    padding: 64px 40px;
    flex-direction: row;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }
`

const FooterBrand = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`

const FooterLogo = styled.img`
  height: 200px;
  width: auto;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    height: 200px;
  }
`

const FooterNav = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  text-align: center;

  @media (min-width: 768px) {
    gap: 60px;
    text-align: left;
  }
`

const FooterCol = styled.div``

const FooterColTitle = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
  margin-bottom: 16px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`

const FooterLink = styled.a`
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`

const FooterBottom = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255,255,255,0.3);

  @media (min-width: 768px) {
    padding: 24px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
`
