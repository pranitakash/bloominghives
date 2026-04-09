import createGlobe from 'cobe';

// ═══════════════════════════════════════════════════
// COBE GLOBE — Footer interactive globe (Magic UI style)
// ═══════════════════════════════════════════════════

const canvas = document.getElementById('cobe-globe');

if (canvas) {
  let phi = 0;
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;

  const globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: 1200,
    height: 1200,
    phi: 0,
    theta: 0.3,
    dark: 0,
    diffuse: 3,
    mapSamples: 25000,
    mapBrightness: 1.2,
    baseColor: [1, 1, 1],
    markerColor: [1, 0.5, 0.2],
    glowColor: [1.2, 1.2, 1.2],
    markers: [
      { location: [28.6139, 77.209], size: 0.08 }, // Delhi
      { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
      { location: [12.9716, 77.5946], size: 0.05 }, // Bangalore
      { location: [51.5074, -0.1278], size: 0.04 }, // London
      { location: [40.7128, -74.006], size: 0.04 }, // NY
      { location: [25.2048, 55.2708], size: 0.04 }, // Dubai
    ],
    onRender: (state) => {
      if (!pointerInteracting) {
        phi += 0.005;
      }
      state.phi = phi + pointerInteractionMovement;
    },
  });

  // Drag logic
  canvas.addEventListener('pointerdown', (e) => {
    pointerInteracting = e.clientX;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('pointerup', () => {
    pointerInteracting = null;
    canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('pointermove', (e) => {
    if (pointerInteracting !== null) {
      const delta = e.clientX - pointerInteracting;
      pointerInteractionMovement += delta / 200;
      pointerInteracting = e.clientX;
    }
  });

  // Touch logic
  canvas.addEventListener('touchmove', (e) => {
    if (pointerInteracting !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting;
      pointerInteractionMovement += delta / 200;
      pointerInteracting = e.touches[0].clientX;
    }
  }, { passive: true });
}
