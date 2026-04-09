import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Dynamically toggles the header's `header--on-light` class based on which
 * section the header currently overlaps.
 *
 * Any element with `data-theme="light"` acts as a trigger — when it
 * intersects the top strip of the viewport (where the fixed header sits),
 * the header switches to dark-text styling. Otherwise it stays light (for dark bg).
 */
export default function useHeaderTheme() {
  const { pathname } = useLocation();

  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    // Track which light sections are currently intersecting the header zone
    const activeLightSections = new Set();

    const updateHeader = () => {
      if (activeLightSections.size > 0) {
        header.classList.add('header--on-light');
      } else {
        header.classList.remove('header--on-light');
      }
    };

    // Calculate bottom margin to shrink observation area to just the header height
    // The header is roughly 88px tall (20px padding * 2 + 48px logo)
    const headerHeight = 88;
    const bottomMargin = -(window.innerHeight - headerHeight);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeLightSections.add(entry.target);
          } else {
            activeLightSections.delete(entry.target);
          }
        });
        updateHeader();
      },
      {
        // Only detect intersections in the top ~88px where the header sits
        rootMargin: `0px 0px ${bottomMargin}px 0px`,
      }
    );

    // Small delay to let DOM settle after route changes
    const timeoutId = setTimeout(() => {
      const sections = document.querySelectorAll('[data-theme="light"]');
      sections.forEach((section) => observer.observe(section));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      activeLightSections.clear();
      // Reset header on cleanup
      if (header) header.classList.remove('header--on-light');
    };
  }, [pathname]); // Re-run when route changes
}
