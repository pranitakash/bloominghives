/* ═══════════════════════════════════════════════════
   BLOOMING HIVES — Contact Page Scripts (Kota Style)
   ═══════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

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
// HERO CANVAS ANIMATION (Lava Lamp Gradient)
// ═══════════════════════════════════════════════════
(function initContactCanvas() {
  const canvas = document.getElementById('contact-bg-canvas');
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
    { x: 0.2, y: 0.2, r: 0.6, color: [167, 139, 250], vx: 0.0015, vy: 0.001 },   // Purple
    { x: 0.8, y: 0.3, r: 0.5, color: [236, 72, 153], vx: -0.002, vy: 0.0015 },  // Pink
    { x: 0.5, y: 0.7, r: 0.7, color: [96, 165, 250], vx: 0.001, vy: -0.002 },   // Blue
    { x: 0.3, y: 0.8, r: 0.45, color: [52, 211, 153], vx: 0.0025, vy: -0.001 }, // Teal
  ];

  function animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.fillStyle = '#f8f8f8';
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
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.25)`);
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
// REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════
window.addEventListener('load', () => {
  const hero = document.querySelector('.contact-hero');
  if (hero) hero.classList.add('active');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

  tl.to('.title-line span', {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    delay: 0.3
  });

  tl.from('.hero-arrow', {
    scale: 0.5,
    opacity: 0,
    duration: 1,
  }, '-=0.8');

  // Form elements entry
  gsap.from('.interests-container > *', {
    scrollTrigger: {
      trigger: '.interests-container',
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.form-row', {
    scrollTrigger: {
      trigger: '.main-form',
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.from('.info-block', {
    scrollTrigger: {
      trigger: '.info-grid',
      start: 'top 90%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.08,
    duration: 1,
    ease: 'power3.out'
  });
});

// ─── Floating CTA Visibility ───
const floatingCta = document.getElementById('floating-cta');
window.addEventListener('scroll', () => {
  if (floatingCta) {
    floatingCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
  }
}, { passive: true });

// ═══════════════════════════════════════════════════
// FORM INTERACTIVITY
// ═══════════════════════════════════════════════════

// Interest Chips Toggle
const chips = document.querySelectorAll('.interest-chip');
chips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.preventDefault();
    chip.classList.toggle('active');
    
    // Scale effect
    gsap.fromTo(chip, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
  });
});

// Textarea Auto-resize
const textarea = document.getElementById('message');
if (textarea) {
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });
}

// File name update
const fileInput = document.getElementById('attachments');
const fileLabel = document.querySelector('.file-trigger span');
if (fileInput && fileLabel) {
  fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    if (files.length > 0) {
      fileLabel.textContent = files.length === 1 ? files[0].name : `${files.length} files selected`;
      fileLabel.style.color = '#1a1a1a';
    } else {
      fileLabel.textContent = 'Attachments';
      fileLabel.style.color = '';
    }
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
}
