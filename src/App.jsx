import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useLenis from './hooks/useLenis';
import useHeaderTheme from './hooks/useHeaderTheme';
import Header from './components/Header';
import MenuOverlay from './components/MenuOverlay';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Service from './pages/Service';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useLenis();
  useHeaderTheme();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  // Determine if footer needs dark wrapper (non-home pages)
  const footerWrapDark = !isHome;

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <>
      <ScrollToTop />
      <Header onToggleMenu={toggleMenu} menuOpen={menuOpen} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service/:slug" element={<Service />} />
      </Routes>

      <Footer wrapDark={footerWrapDark} />
      <FloatingCTA />
    </>
  );
}
