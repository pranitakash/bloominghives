import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';

const services = [
  { to: '/service/smm', label: 'Social Media Management' },
  { to: '/service/seo', label: 'Search Engine Optimization' },
  { to: '/service/webdev', label: 'Website Development' },
  { to: '/service/ads', label: 'Google and Meta Ads' },
  { to: '/service/content', label: 'Content Writing' },
  { to: '/service/video', label: 'Video Editing' },
  { to: '/service/graphic', label: 'Graphic Designing' },
  { to: '/service/photoshoot', label: 'Photoshoot' },
];

export default function MenuOverlay({ isOpen, onClose }) {
  const location = useLocation();
  const path = location.pathname;
  const [servicesExpanded, setServicesExpanded] = useState(false);

  const handleClose = () => {
    onClose();
    setServicesExpanded(false);
  };

  const toggleServices = (e) => {
    e.preventDefault();
    setServicesExpanded(prev => !prev);
  };

  return (
    <nav className={`menu-overlay${isOpen ? ' open' : ''}`} id="menu-overlay" aria-hidden={!isOpen}>
      <div className="menu-overlay__inner">
        <ul className="menu-overlay__list">
          <li><Link to="/#work" className="menu-overlay__link" onClick={handleClose}>Work</Link></li>
          <li><Link to="/about" className={`menu-overlay__link${path === '/about' ? ' active' : ''}`} onClick={handleClose}>About</Link></li>
          <li className={servicesExpanded ? 'expanded' : ''}>
            <a href="#" className="menu-overlay__link" onClick={toggleServices}>Services <span className="menu-plus">+</span></a>
            <ul className="menu-overlay__sublist">
              {services.map(s => (
                <li key={s.to}><Link to={s.to} onClick={handleClose}>{s.label}</Link></li>
              ))}
            </ul>
          </li>
          <li><Link to="/blog" className={`menu-overlay__link${path === '/blog' ? ' active' : ''}`} onClick={handleClose}>Blog</Link></li>
          <li><Link to="/contact" className={`menu-overlay__link${path === '/contact' ? ' active' : ''}`} onClick={handleClose}>Contact</Link></li>
        </ul>
        <Link to="/contact" className="btn-pill btn-pill--menu" onClick={handleClose}>
          <span>Start Your Project</span>
          <ArrowIcon />
        </Link>
      </div>
    </nav>
  );
}
