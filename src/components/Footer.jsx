import { Link } from 'react-router-dom';
import Globe from './Globe';

export default function Footer({ wrapDark = false }) {
  const footer = (
    <footer className="site-footer" id="footer">
      <div className="footer__globe">
        <Globe />
      </div>

      <div className="footer__main">
        <div className="footer__logo">
          <svg viewBox="0 0 60 60" className="logo-svg logo-svg--footer">
            <rect x="2" y="2" width="56" height="56" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="800" fill="currentColor" fontFamily="Inter, sans-serif">BH</text>
          </svg>
        </div>
        <a href="mailto:Info@bloominghives.in" className="footer__email">Info@bloominghives.in</a>
      </div>

      <div className="footer__row">
        <div className="footer__socials">
          <a href="https://www.facebook.com/profile.php?id=61586175253187" className="footer__social-link" target="_blank" rel="noopener noreferrer">Facebook <span className="arrow-up-right">↗</span></a>
          <a href="https://www.instagram.com/bloominghives.in" className="footer__social-link" target="_blank" rel="noopener noreferrer">Instagram <span className="arrow-up-right">↗</span></a>
          <a href="https://www.linkedin.com/company/bloominghives/" className="footer__social-link" target="_blank" rel="noopener noreferrer">LinkedIn <span className="arrow-up-right">↗</span></a>
          <a href="https://wa.me/919217542713" className="footer__social-link" target="_blank" rel="noopener noreferrer">WhatsApp <span className="arrow-up-right">↗</span></a>
        </div>
        <div className="footer__badges-row">
          <span className="footer__badge-item">★ 5-Star Rated</span>
          <span className="footer__badge-item">◆ Google Partner</span>
        </div>
      </div>

      <div className="footer__row">
        <div className="footer__links">
          <Link to="/contact">Contact</Link>
          <Link to="/#faq">FAQs</Link>
          <a href="https://bloominghives.in/privacy-policy/">Privacy Policy</a>
          <a href="https://bloominghives.in/terms-conditions/">Terms &amp; Conditions</a>
        </div>
        <a href="#" className="btn-pill btn-pill--outline btn-pill--light btn-pill--small footer__newsletter">
          <span>Sign up to our newsletter</span>
        </a>
      </div>

      <div className="footer__bottom">
        <div className="footer__sectors">
          <span className="footer__sectors-label">Our sectors :</span>
          <a href="#" className="pill pill--dark">Real Estate</a>
          <a href="#" className="pill pill--dark">Food &amp; Restaurants</a>
          <a href="#" className="pill pill--dark">Fashion &amp; Lifestyle</a>
          <a href="#" className="pill pill--dark">Education</a>
          <a href="#" className="pill pill--dark">Healthcare</a>
          <a href="#" className="pill pill--dark">E-Commerce</a>
        </div>
        <span className="footer__copyright">© 2026 Blooming Hives. All Rights Reserved.</span>
      </div>
    </footer>
  );

  if (wrapDark) {
    return <div className="footer-dark-wrapper">{footer}</div>;
  }
  return footer;
}
