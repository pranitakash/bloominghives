import { useEffect, useRef, useCallback, useState } from 'react';
import createGlobe from 'cobe';

const MOVEMENT_DAMPING = 1400;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

export default function Globe({ className = '' }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const phiRef = useRef(0);
  const pointerInteracting = useRef(null);
  const springValue = useRef(0);
  const springTarget = useRef(0);
  const isVisibleRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  const updatePointerInteraction = useCallback((value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
    }
  }, []);

  const updateMovement = useCallback((clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      springTarget.current = springTarget.current + delta / MOVEMENT_DAMPING;
    }
  }, []);

  // Only initialize the globe when it enters the viewport (lazy init)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !initialized) {
          setInitialized(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '200px' }
    );
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [initialized]);

  // Create the globe only once initialized (lazy)
  useEffect(() => {
    if (!initialized) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = 0;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    // Visibility observer to pause rendering when off-screen
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0, rootMargin: '100px' }
    );
    visObserver.observe(canvas);

    const globe = createGlobe(canvas, {
      devicePixelRatio: DPR,
      width: width * DPR,
      height: width * DPR,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 12000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.5, 0.1],
      glowColor: [1, 1, 1],
      scale: 1,
      offset: [0, width * 0.35],
      markers: [
        { location: [28.6139, 77.209], size: 0.12 },
        { location: [19.076, 72.8777], size: 0.08 },
        { location: [12.9716, 77.5946], size: 0.06 },
        { location: [28.4595, 77.0266], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.06 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [1.3521, 103.8198], size: 0.04 },
        { location: [25.2048, 55.2708], size: 0.06 },
        { location: [-33.8688, 151.2093], size: 0.04 },
        { location: [35.6762, 139.6503], size: 0.05 },
      ],
      onRender: (state) => {
        if (!isVisibleRef.current) return;

        if (!pointerInteracting.current) {
          phiRef.current += 0.005;
        }
        springValue.current += (springTarget.current - springValue.current) * 0.08;

        state.phi = phiRef.current + springValue.current;
        state.width = width * DPR;
        state.height = width * DPR;
      },
    });

    setTimeout(() => {
      if (canvas) canvas.style.opacity = '1';
    });

    return () => {
      globe.destroy();
      visObserver.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [initialized]);

  return (
    <div className={`globe-wrapper ${className}`} ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
