import { useEffect, useRef } from 'react';

/**
 * Animated blob canvas used on About, Blog, Contact hero backgrounds.
 * Pauses when scrolled out of view to free up the main thread.
 * @param {string} bgColor - Base background color (e.g. '#f0ede8' for light, '#0a0a0a' for dark)
 * @param {string} compositeOp - Canvas composite operation ('multiply' for light pages, 'lighter' for dark)
 * @param {number} blobOpacity - Blob color stop opacity (0.2 for light, 0.85 for dark)
 */
export default function useHeroCanvas(bgColor = '#f0ede8', compositeOp = 'multiply', blobOpacity = 0.2) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    // Cap DPR at 1 for this canvas — blobs are soft gradients, high-DPR is invisible but 4× the pixel work
    const dpr = 1;
    let animId;
    let isVisible = true;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', debouncedResize);

    // Pause animation when canvas scrolls out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const blobs = [
      { x: 0.25, y: 0.25, r: 0.55, color: [167, 139, 250], vx: 0.0012, vy: 0.0008 },
      { x: 0.75, y: 0.35, r: 0.45, color: [236, 72, 153], vx: -0.0018, vy: 0.0012 },
      { x: 0.5, y: 0.65, r: 0.6, color: [96, 165, 250], vx: 0.0008, vy: -0.0015 },
      { x: 0.35, y: 0.8, r: 0.4, color: [52, 211, 153], vx: 0.002, vy: -0.0008 },
      { x: 0.8, y: 0.7, r: 0.35, color: [249, 168, 212], vx: -0.0014, vy: 0.0018 },
    ];

    function animate() {
      if (!isVisible) {
        animId = null;
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -0.2 || b.x > 1.2) b.vx *= -1;
        if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;

        const grad = ctx.createRadialGradient(
          b.x * w, b.y * h, 0,
          b.x * w, b.y * h, b.r * Math.max(w, h)
        );
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, ${blobOpacity})`);
        grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0)`);

        ctx.globalCompositeOperation = compositeOp;
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener('resize', debouncedResize);
    };
  }, [bgColor, compositeOp, blobOpacity]);

  return canvasRef;
}
