import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

const MOVEMENT_DAMPING = 1400;

export default function Globe({ className = '' }) {
  const canvasRef = useRef(null);
  const phiRef = useRef(0);
  const pointerInteracting = useRef(null);
  const springValue = useRef(0);
  const springTarget = useRef(0);

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

  useEffect(() => {
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

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
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
        if (!pointerInteracting.current) {
          phiRef.current += 0.005;
        }
        springValue.current += (springTarget.current - springValue.current) * 0.08;

        state.phi = phiRef.current + springValue.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvas) canvas.style.opacity = '1';
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`globe-wrapper ${className}`}>
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
