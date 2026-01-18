import { ReactNode, useEffect, useState } from 'react'
import LogoWordmark from '../../assets/LAAGAM ASSETS LOGOS-01 WHITE.png'
import LogoCombined from '../../assets/LAAGAM ASSETS LOGOS-03 WHITE.png'
import LaagamVideo from '../../../Video/SnapInsta.to_AQP_XDfE3y7thGZu9NR8KoEDnjUj5Zk8vQIDvU2yyXy3de8kRYTCLd7gRPnDlE717FCQIoAtjcuaAcUDdgJHNURewvqZ0lS6DeSNWYA.mp4'
import './LaagamLanding.css'

interface LaagamLandingProps {
  children: ReactNode
}

export function LaagamLanding({ children }: LaagamLandingProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-page">
      {/* Fixed Header */}
      <header className={`landing-header ${isLoaded ? 'visible' : ''}`}>
        <a href="https://laagam.com" className="logo-link">
          <img src={LogoWordmark} alt="LAAGAM" className="header-logo" />
        </a>
        <nav className="landing-nav">
          <a href="https://laagam.com" className="nav-link">Shop</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className={`hero-inner ${isLoaded ? 'visible' : ''}`}>
          {/* Video */}
          <div className="video-wrapper">
            <video
              src={LaagamVideo}
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
            />
          </div>

          {/* Text Content */}
          <div className="hero-text">
            <h1 className="hero-title">
              <span>The </span>
              <span className="title-accent">Sound </span>
              <span>of </span>
              <span className="title-accent">Style</span>
            </h1>
            <p className="hero-subtitle">
              Curated playlists that embody our vision of contemporary fashion.
            </p>
            <a href="#player" onClick={handleExploreClick} className="cta-button">
              Explore LAAGAM Music
            </a>
          </div>
        </div>
      </section>

      {/* iPod Player */}
      <section id="player" className="player-section">
        <div className="player-wrapper">
          {children}
          <span className="player-hint">Spin the wheel to navigate</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">01</span>
            <h3 className="step-title">Add your music</h3>
            <p className="step-desc">Paste any YouTube URL or playlist</p>
          </div>
          <div className="step">
            <span className="step-number">02</span>
            <h3 className="step-title">Classic interface</h3>
            <p className="step-desc">Experience the iconic click wheel</p>
          </div>
          <div className="step">
            <span className="step-number">03</span>
            <h3 className="step-title">Express yourself</h3>
            <p className="step-desc">Create playlists that reflect your style</p>
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="statement">
        <p className="statement-text">
          LAAGAM is an independent ready-to-wear fashion brand for{' '}
          <em>women in control.</em>
        </p>
        <div className="statement-meta">
          <div className="meta-item">
            <span className="meta-label">Mission</span>
            <span className="meta-value">Contemporary self-expression</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Origin</span>
            <span className="meta-value">Barcelona, Spain</span>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="landing-section">
        <h2 className="section-title">In The Press</h2>
        <div className="press">
          <div className="press-item">
            <div className="press-name">VOGUE</div>
            <p className="press-quote">"Will define the future of fashion"</p>
          </div>
          <div className="press-item">
            <div className="press-name">Forbes</div>
            <p className="press-quote">"30 under 30 Europe"</p>
          </div>
          <div className="press-item">
            <div className="press-name">WIRED</div>
            <p className="press-quote">"One of Europe's hottest startups"</p>
          </div>
          <div className="press-item">
            <div className="press-name">hypebae</div>
            <p className="press-quote">"Have entered a whole new world"</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={LogoCombined} alt="LAAGAM" className="footer-logo" />
          </div>
          <div className="footer-nav">
            <div className="footer-col">
              <span className="footer-col-title">Shop</span>
              <a href="https://laagam.com/collections/new-in" className="footer-link">New In</a>
              <a href="https://laagam.com/collections/all" className="footer-link">All</a>
              <a href="https://laagam.com/collections/bestsellers" className="footer-link">Bestsellers</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Info</span>
              <a href="https://laagam.com/pages/about" className="footer-link">About</a>
              <a href="https://laagam.com/pages/contact" className="footer-link">Contact</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Social</span>
              <a href="https://www.instagram.com/laagam/" className="footer-link">Instagram</a>
              <a href="https://www.tiktok.com/@laagam" className="footer-link">TikTok</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 LAAGAM</span>
          <span>LAAGAM.COM</span>
        </div>
      </footer>
    </div>
  )
}
