/* ═══════════════════════════════════════════════════
   BLOOMING HIVES — Blog Page Scripts (v2 — Smooth & Premium)
   ═══════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════
// LENIS SMOOTH SCROLL
// ═══════════════════════════════════════════════════
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ═══════════════════════════════════════════════════
// HERO CANVAS (Dreamy soft gradient — feels alive)
// ═══════════════════════════════════════════════════
(function initBlogCanvas() {
  const canvas = document.getElementById('blog-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let t = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.2, y: 0.3, r: 0.52, color: [200, 220, 240], vx: 0.0005, vy: 0.0003 },
    { x: 0.75, y: 0.35, r: 0.48, color: [230, 190, 240], vx: -0.0007, vy: 0.0005 },
    { x: 0.45, y: 0.7, r: 0.55, color: [250, 200, 220], vx: 0.0004, vy: -0.0006 },
    { x: 0.85, y: 0.65, r: 0.38, color: [180, 230, 210], vx: -0.0006, vy: 0.0008 },
    { x: 0.15, y: 0.8, r: 0.36, color: [240, 225, 200], vx: 0.0008, vy: -0.0004 },
  ];

  function animate() {
    t += 0.003;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.fillStyle = '#f5f2ed';
    ctx.fillRect(0, 0, w, h);

    blobs.forEach((b, i) => {
      // Organic wobble using sine
      const ox = Math.sin(t + i * 1.7) * 0.02;
      const oy = Math.cos(t + i * 2.3) * 0.02;
      b.x += b.vx + ox * 0.01;
      b.y += b.vy + oy * 0.01;
      if (b.x < -0.15 || b.x > 1.15) b.vx *= -1;
      if (b.y < -0.15 || b.y > 1.15) b.vy *= -1;

      const grad = ctx.createRadialGradient(
        b.x * w, b.y * h, 0,
        b.x * w, b.y * h, b.r * Math.max(w, h)
      );
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.28)`);
      grad.addColorStop(0.5, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.12)`);
      grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0)`);

      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
  }
  animate();
})();

// ═══════════════════════════════════════════════════
// HERO REVEAL — Elegant staggered entrance
// ═══════════════════════════════════════════════════
window.addEventListener('load', () => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.blog-page .title-line span', {
    y: 0,
    opacity: 1,
    duration: 1.4,
    stagger: 0.12,
    delay: 0.2,
  });
});

// ═══════════════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS — Smooth & sequential
// ═══════════════════════════════════════════════════
const smoothEase = 'power3.out';

// Featured post — slides up with parallax feel
gsap.from('.blog-featured__card', {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: smoothEase,
  scrollTrigger: {
    trigger: '.blog-featured',
    start: 'top 82%',
    toggleActions: 'play none none none',
  },
});

// Blog cards — each reveals independently on scroll
gsap.utils.toArray('.blog-card').forEach((card, i) => {
  gsap.from(card, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay: (i % 3) * 0.1,
    ease: smoothEase,
    scrollTrigger: {
      trigger: card,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
});

// Newsletter section
gsap.from('.blog-newsletter__inner', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: smoothEase,
  scrollTrigger: {
    trigger: '.blog-newsletter',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// ═══════════════════════════════════════════════════
// FILTER LOGIC — Smooth GSAP transitions
// ═══════════════════════════════════════════════════
const filterChips = document.querySelectorAll('.filter-chip');
const blogCards = document.querySelectorAll('.blog-card');

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    // Update active state
    filterChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;
    let delay = 0;

    blogCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;

      if (matches) {
        card.classList.remove('hidden');
        gsap.fromTo(card,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6,
            delay: delay * 0.08,
            ease: 'power3.out',
          }
        );
        delay++;
      } else {
        gsap.to(card, {
          opacity: 0,
          y: -20,
          scale: 0.96,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => card.classList.add('hidden'),
        });
      }
    });
  });
});

// ═══════════════════════════════════════════════════
// FLOATING CTA
// ═══════════════════════════════════════════════════
const floatingCta = document.getElementById('floating-cta');
window.addEventListener('scroll', () => {
  if (floatingCta) {
    floatingCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
  }
}, { passive: true });

// ═══════════════════════════════════════════════════
// FOOTER BLOB
// ═══════════════════════════════════════════════════
const footerBlob = document.querySelector('.footer__blob-visual');
if (footerBlob) {
  gsap.to(footerBlob, {
    scrollTrigger: {
      trigger: '.footer__blob',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
    rotation: 360,
    ease: 'none',
  });

  gsap.from(footerBlob, {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.4)',
    scrollTrigger: {
      trigger: '.footer__blob',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ═══════════════════════════════════════════════════
// MENU TOGGLE
// ═══════════════════════════════════════════════════
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');

const backdrop = document.createElement('div');
backdrop.classList.add('menu-backdrop');
document.body.appendChild(backdrop);

function openMenu() {
  menuToggle.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuOverlay.classList.add('open');
  menuOverlay.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('visible');
  lenis.stop();
}

function closeMenu() {
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuOverlay.classList.remove('open');
  menuOverlay.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('visible');
  document.querySelectorAll('.menu-overlay__list li.expanded').forEach(li => li.classList.remove('expanded'));
  lenis.start();
}

if (menuToggle && menuOverlay) {
  menuToggle.addEventListener('click', () => {
    menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);

  // Services submenu toggle
  document.querySelectorAll('.menu-overlay__link').forEach(link => {
    if (link.querySelector('.menu-plus')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        link.closest('li').classList.toggle('expanded');
      });
    }
  });

  document.querySelectorAll('[data-menu-link]').forEach(link => {
    if (!link.querySelector('.menu-plus')) {
      link.addEventListener('click', closeMenu);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ═══════════════════════════════════════════════════
// SMOOTH SCROLL ANCHORS
// ═══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    }
  });
});
