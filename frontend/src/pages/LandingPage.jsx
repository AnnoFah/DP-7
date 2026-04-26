import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const circleRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (circleRef.current) {
        circleRef.current.style.transition = 'stroke-dashoffset 1.5s ease';
        circleRef.current.style.strokeDashoffset = '72';
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const apps = [
    { name: 'VSCode', color: '#10b981', pct: 70, time: '4j' },
    { name: 'Zoom',   color: '#6366f1', pct: 30, time: '1.5j' },
    { name: 'TikTok', color: '#f87171', pct: 20, time: '55m' },
    { name: 'YouTube',color: '#fbbf24', pct: 15, time: '40m' },
  ];

  const stats = [
    { num: '2', suffix: 'k+', label: 'Pengguna Aktif' },
    { num: '78', suffix: '%',  label: 'Rata-rata Focus Score' },
    { num: '4',  suffix: '.9', label: 'Rating Pengguna' },
  ];

  return (
    <div className="landing">

      {/* ======= NAVBAR ======= */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <span className="nav-logo-dot" />
          FocusMonitor
        </div>

        <ul className="nav-links">
          {['Beranda', 'Fitur', 'Harga', 'Tentang'].map(item => (
            <li key={item}><a href="#">{item}</a></li>
          ))}
        </ul>

        <div className="nav-buttons">
          <button className="btn-ghost" onClick={() => navigate('/login')}>
            Masuk
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Mulai Gratis
          </button>
        </div>

        {/* Hamburger untuk mobile */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {['Beranda', 'Fitur', 'Harga', 'Tentang'].map(item => (
          <a key={item} href="#" onClick={() => setMobileMenuOpen(false)}>
            {item}
          </a>
        ))}
        <div className="mobile-menu-buttons">
          <button
            className="btn-ghost"
            style={{ flex: 1 }}
            onClick={() => navigate('/login')}
          >
            Masuk
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => navigate('/register')}
          >
            Mulai Gratis
          </button>
        </div>
      </div>

      {/* ======= HERO ======= */}
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-dots" />

        {/* LEFT */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Pantau Fokusmu Setiap Hari
          </div>

          <h1 className="hero-title">
            Kendalikan{' '}
            <span className="hero-title-accent">Waktumu,</span>
            <br />
            Tingkatkan Fokus
          </h1>

          <p className="hero-sub">
            Analisis screen time, hitung focus score, dan bangun kebiasaan
            produktif dengan sistem monitoring berbasis data yang cerdas.
          </p>

          <div className="hero-cta">
            <button className="btn-hero" onClick={() => navigate('/register')}>
              Mulai Sekarang →
            </button>
            <button className="btn-outline" onClick={() => navigate('/login')}>
              Lihat Demo
            </button>
          </div>

          <div className="hero-stats">
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="stat-num">
                  {stat.num}
                  <span className="stat-accent">{stat.suffix}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">

          {/* Float Card Kiri */}
          <div className="float-card float-card-left">
            <div className="float-card-title">Screen Time Hari Ini</div>
            <div className="float-card-value">
              6.4 <span>jam</span>
            </div>
            <div className="float-card-sub text-green">
              ↓ 1.2 jam dari kemarin
            </div>
          </div>

          {/* Phone Frame */}
          <div className="phone-frame">
            <div className="phone-notch" />

            {/* Score Ring */}
            <div className="score-ring-wrap">
              <svg
                className="score-svg"
                width="120"
                height="120"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="9"
                />
                <circle
                  ref={circleRef}
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="9"
                  strokeDasharray="314"
                  strokeDashoffset="314"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <span className="score-number">75</span>
            </div>
            <div className="score-label">Focus Score Hari Ini</div>

            {/* App List */}
            {apps.map(app => (
              <div key={app.name} className="app-row">
                <div
                  className="app-dot"
                  style={{ background: app.color }}
                />
                <span className="app-name">{app.name}</span>
                <div className="app-bar-wrap">
                  <div
                    className="app-bar"
                    style={{ width: `${app.pct}%`, background: app.color }}
                  />
                </div>
                <span className="app-time">{app.time}</span>
              </div>
            ))}

            <button
              className="phone-btn"
              onClick={() => navigate('/register')}
            >
              Mulai Mode Fokus
            </button>
          </div>

          {/* Float Card Kanan */}
          <div className="float-card float-card-right">
            <div className="float-card-title">Warning Hari Ini</div>
            <div className="float-card-value">0</div>
            <div className="float-card-sub text-green">
              Tetap pertahankan!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}