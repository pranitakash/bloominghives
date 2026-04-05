// ═══════════════════════════════════════════════════
// Header Contrast Detection
// Dynamically switches navbar colors based on
// whether it overlaps a light or dark section.
// ═══════════════════════════════════════════════════

/**
 * Initializes the header contrast observer.
 * Adds/removes `header--on-light` class on .site-header
 * when it overlaps sections marked with `data-theme="light"`.
 */
export function initHeaderContrast() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // Track which light sections currently overlap the header
  const overlappingLightSections = new Set();

  function updateHeaderState() {
    header.classList.toggle('header--on-light', overlappingLightSections.size > 0);
  }

  // Grab all sections marked as light
  const lightSections = document.querySelectorAll('[data-theme="light"]');
  if (lightSections.length === 0) return;

  // The rootMargin clips the observation to a thin strip at the
  // very top of the viewport (where the header sits).
  // Negative bottom margin = (viewport height - header height ~88px)
  // We use a callback to figure out the exact value dynamically.
  const headerHeight = 88; // approximate fixed header height in px

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          overlappingLightSections.add(entry.target);
        } else {
          overlappingLightSections.delete(entry.target);
        }
      });
      updateHeaderState();
    },
    {
      // Only observe intersections in the top strip of the viewport
      // where the header lives (top 88px).
      rootMargin: `0px 0px -${window.innerHeight - headerHeight}px 0px`,
      threshold: 0,
    }
  );

  lightSections.forEach((section) => observer.observe(section));

  // Re-create observer on resize since rootMargin is static
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      observer.disconnect();
      const newObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              overlappingLightSections.add(entry.target);
            } else {
              overlappingLightSections.delete(entry.target);
            }
          });
          updateHeaderState();
        },
        {
          rootMargin: `0px 0px -${window.innerHeight - headerHeight}px 0px`,
          threshold: 0,
        }
      );
      lightSections.forEach((section) => newObserver.observe(section));
    }, 200);
  });
}
