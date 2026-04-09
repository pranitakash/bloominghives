import { Link } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';

export default function Header({ onLight = false, onToggleMenu }) {
  return (
    <header className={`site-header${onLight ? ' header--on-light' : ''}`} id="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" id="logo" aria-label="Blooming Hives Home">
          <svg viewBox="0 0 60 60" className="logo-svg">
            <rect x="2" y="2" width="56" height="56" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill="currentColor" fontFamily="Inter, sans-serif">BH</text>
          </svg>
        </Link>
        <div className="header-actions">
          <Link to="/contact" className="btn-pill btn-pill--header" id="header-cta">
            <span>Get Started</span>
            <ArrowIcon />
          </Link>
          <button className="menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false" onClick={onToggleMenu}>
            <span className="menu-toggle__line"></span>
            <span className="menu-toggle__line"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
