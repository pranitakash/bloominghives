/* ═══════════════════════════════════════════════════
   BLOOMING HIVES — About Page Scripts
   ═══════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeaderContrast } from './header-contrast.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize header contrast detection
initHeaderContrast();

// ═══════════════════════════════════════════════════
// LENIS SMOOTH SCROLL
// ═══════════════════════════════════════════════════
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ═══════════════════════════════════════════════════
// HERO CANVAS ANIMATION (Liquid Gradient)
// ═══════════════════════════════════════════════════
(function initAboutCanvas() {
  const canvas = document.getElementById('about-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = [
    { x: 0.25, y: 0.25, r: 0.55, color: [167, 139, 250], vx: 0.0012, vy: 0.0008 },
    { x: 0.75, y: 0.35, r: 0.45, color: [236, 72, 153], vx: -0.0018, vy: 0.0012 },
    { x: 0.5, y: 0.65, r: 0.6, color: [96, 165, 250], vx: 0.0008, vy: -0.0015 },
    { x: 0.35, y: 0.8, r: 0.4, color: [52, 211, 153], vx: 0.002, vy: -0.0008 },
    { x: 0.8, y: 0.7, r: 0.35, color: [249, 168, 212], vx: -0.0014, vy: 0.0018 },
  ];

  function animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.fillStyle = '#f0ede8';
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
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.2)`);
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
// HERO REVEAL ANIMATION
// ═══════════════════════════════════════════════════
window.addEventListener('load', () => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

  tl.to('.about-page .title-line span', {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    delay: 0.3,
  });

  tl.from('.about-hero__label', {
    y: 20,
    opacity: 0,
    duration: 0.8,
  }, '-=0.6');
});

// ═══════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════
const ease = 'power3.out';

// Mission Statement
gsap.from('.about-mission__headline', {
  yPercent: 40,
  opacity: 0,
  duration: 1,
  ease,
  scrollTrigger: {
    trigger: '.about-mission',
    start: 'top 75%',
    toggleActions: 'play none none none',
  },
});

gsap.from('.about-mission__text', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease,
  scrollTrigger: {
    trigger: '.about-mission__right',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// Values — Outline text
gsap.utils.toArray('.about-values .outline-text').forEach((text) => {
  gsap.from(text, {
    yPercent: 80,
    opacity: 0,
    duration: 1,
    ease,
    scrollTrigger: {
      trigger: text,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });

  gsap.to(text, {
    xPercent: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
});

// Value Cards
gsap.utils.toArray('.value-card').forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    duration: 0.7,
    delay: i * 0.1,
    ease,
    scrollTrigger: {
      trigger: '.about-values__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
});

// Stats
gsap.utils.toArray('.stat-block').forEach((block, i) => {
  gsap.from(block, {
    y: 40,
    opacity: 0,
    scale: 0.92,
    duration: 0.7,
    delay: i * 0.1,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
});

// Services
gsap.from('.about-services__title', {
  yPercent: 40,
  opacity: 0,
  duration: 0.8,
  ease,
  scrollTrigger: {
    trigger: '.about-services__header',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

gsap.utils.toArray('.about-service-item').forEach((item, i) => {
  gsap.from(item, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    delay: i * 0.1,
    ease,
    scrollTrigger: {
      trigger: '.about-services__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
});

// CTA
gsap.from('.about-cta__title', {
  yPercent: 50,
  opacity: 0,
  duration: 1,
  ease,
  scrollTrigger: {
    trigger: '.about-cta',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// ═══════════════════════════════════════════════════
// FLOATING CTA VISIBILITY
// ═══════════════════════════════════════════════════
const floatingCta = document.getElementById('floating-cta');
window.addEventListener('scroll', () => {
  if (floatingCta) {
    floatingCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
  }
}, { passive: true });

// ═══════════════════════════════════════════════════
// FOOTER BLOB ANIMATION
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
// SMOOTH SCROLL FOR ANCHOR LINKS
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
