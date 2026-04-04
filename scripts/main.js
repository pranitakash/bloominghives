// ═══════════════════════════════════════════════════
// BLOOMING HIVES — Kota-Style Scroll Animations
// Lenis Smooth Scroll + GSAP ScrollTrigger
// ═══════════════════════════════════════════════════

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
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ═══════════════════════════════════════════════════
// HERO "O" — Animated Canvas Gradient (Kota Style)
// ═══════════════════════════════════════════════════
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-o-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Color blobs that float around
  const blobs = [
    { x: 0.3, y: 0.3, r: 0.45, color: [167, 139, 250], vx: 0.003, vy: 0.002 },   // Purple
    { x: 0.7, y: 0.6, r: 0.4, color: [236, 72, 153], vx: -0.004, vy: 0.003 },     // Pink
    { x: 0.5, y: 0.8, r: 0.35, color: [96, 165, 250], vx: 0.002, vy: -0.004 },     // Blue
    { x: 0.2, y: 0.7, r: 0.3, color: [52, 211, 153], vx: 0.005, vy: -0.002 },      // Teal
    { x: 0.8, y: 0.2, r: 0.38, color: [249, 168, 212], vx: -0.003, vy: 0.005 },    // Light pink
  ];

  function animate() {
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Dark base
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, h);

    // Animate and draw blobs
    blobs.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;

      // Bounce
      if (b.x < 0 || b.x > 1) b.vx *= -1;
      if (b.y < 0 || b.y > 1) b.vy *= -1;
      b.x = Math.max(0, Math.min(1, b.x));
      b.y = Math.max(0, Math.min(1, b.y));

      const grad = ctx.createRadialGradient(
        b.x * w, b.y * h, 0,
        b.x * w, b.y * h, b.r * Math.max(w, h)
      );
      grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.85)`);
      grad.addColorStop(0.5, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0.3)`);
      grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]}, 0)`);

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
  }

  animate();
})();
// INTERACTIONS (Menu, Header, FAQ, Testimonials)
// ═══════════════════════════════════════════════════

// ─── Menu Toggle ───
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
  lenis.start();
}

menuToggle.addEventListener('click', () => {
  menuOverlay.classList.contains('open') ? closeMenu() : openMenu();
});
backdrop.addEventListener('click', closeMenu);
document.querySelectorAll('[data-menu-link]').forEach(link => {
  link.addEventListener('click', closeMenu);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ─── Header Scroll State ───
const header = document.getElementById('site-header');
const floatingCta = document.getElementById('floating-cta');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 80);
  floatingCta.classList.toggle('visible', y > window.innerHeight * 0.8);
}, { passive: true });

// ─── FAQ Accordion ───
document.querySelectorAll('.faq__question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open');
    button.setAttribute('aria-expanded', !isOpen);
  });
});

// ─── Testimonials Carousel ───
const track = document.getElementById('testimonials-track');
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-slide').length;

function goToSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentSlide = index;
  gsap.to(track, { x: `-${currentSlide * 100}%`, duration: 0.8, ease: 'power3.out' });
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
[prevBtn, nextBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 6000);
  });
});

// ═══════════════════════════════════════════════════
// GSAP SCROLL ANIMATIONS — Kota Style
// ═══════════════════════════════════════════════════

const ease = 'power3.out';

// ─── Utility: Mask reveal (Kota signature) ───
// Wraps each line in overflow:hidden + inner div, then slides up
function createMaskReveal(selector, options = {}) {
  const elements = gsap.utils.toArray(selector);
  elements.forEach((el) => {
    gsap.from(el, {
      yPercent: 100,
      opacity: 0,
      duration: options.duration || 1,
      delay: options.delay || 0,
      ease: options.ease || ease,
      scrollTrigger: {
        trigger: options.trigger || el,
        start: options.start || 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });
}

// ─── Hero Entrance ───
const heroTl = gsap.timeline({ defaults: { ease } });

heroTl
  .from('.hero__line:nth-child(1)', {
    yPercent: 100, opacity: 0, duration: 1.2, delay: 0.3
  })
  .from('.hero__line:nth-child(2)', {
    yPercent: 100, opacity: 0, duration: 1.2
  }, '-=0.85')
  .from('.hero__line:nth-child(3)', {
    yPercent: 100, opacity: 0, duration: 1.2
  }, '-=0.85')
  .from('.hero__sub', {
    y: 30, opacity: 0, duration: 0.8
  }, '-=0.5')
  .from('.hero__badge', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.12
  }, '-=0.3')
  .from('.hero__o-visual', {
    scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)'
  }, '-=1');

// ─── Services Intro — Mask reveal ───
createMaskReveal('.services-intro .outline-text', {
  trigger: '.services-intro',
  start: 'top 80%',
  duration: 1.2,
});

gsap.from('.services-intro__desc', {
  y: 30, opacity: 0, duration: 0.9, ease,
  scrollTrigger: {
    trigger: '.services-intro',
    start: 'top 70%',
    toggleActions: 'play none none none',
  }
});

// ─── Service Cards — Sticky Stack (Kota Style) ───
const serviceCards = gsap.utils.toArray('.service-card');

serviceCards.forEach((card, i) => {
  // Content stagger reveal when card enters
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  tl.from(card.querySelector('.service-card__title'), {
    yPercent: 60,
    opacity: 0,
    duration: 0.7,
    ease,
  })
  .from(card.querySelectorAll('.pill'), {
    y: 12,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease,
  }, '-=0.35')
  .from(card.querySelector('.service-card__desc'), {
    y: 15,
    opacity: 0,
    duration: 0.5,
    ease,
  }, '-=0.25')
  .from(card.querySelector('.btn-pill'), {
    y: 12,
    opacity: 0,
    duration: 0.4,
    ease,
  }, '-=0.2');

  // Image scale reveal
  const img = card.querySelector('.service-card__img');
  if (img) {
    gsap.from(img, {
      scale: 1.15,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 1,
      }
    });
  }

  // Scale down when next card covers it (except last card)
  // Only scale — no opacity/brightness to prevent dark bleed-through
  if (i < serviceCards.length - 1) {
    gsap.to(card, {
      scale: 0.95,
      scrollTrigger: {
        trigger: serviceCards[i + 1],
        start: 'top bottom',
        end: 'top 10%',
        scrub: 0.5,
      }
    });
  }
});

// ─── Approach Blocks — Slide from sides ───
gsap.utils.toArray('.approach__block').forEach((block) => {
  const isRight = block.classList.contains('approach__block--right');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  tl.from(block.querySelector('.approach__number'), {
    y: -15, opacity: 0, duration: 0.5, ease,
  })
  .from(block.querySelector('.approach__title'), {
    x: isRight ? 60 : -60,
    opacity: 0,
    duration: 0.8,
    ease,
  }, '-=0.3')
  .from(block.querySelector('.approach__desc'), {
    y: 20, opacity: 0, duration: 0.6, ease,
  }, '-=0.3');
});

// ─── Outline Text — Parallax horizontal scrub (Kota signature) ───
gsap.utils.toArray('.outline-text').forEach((text) => {
  // Reveal
  gsap.from(text, {
    yPercent: 80,
    opacity: 0,
    duration: 1,
    ease,
    scrollTrigger: {
      trigger: text,
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });

  // Parallax drift
  gsap.to(text, {
    xPercent: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    }
  });
});

// ─── Work Intro ───
const workTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.work-intro__right',
    start: 'top 80%',
    toggleActions: 'play none none none',
  }
});

workTl
  .from('.work-intro__heading', {
    yPercent: 50, opacity: 0, duration: 0.9, ease,
  })
  .from('.work-intro__desc', {
    y: 25, opacity: 0, duration: 0.7, ease,
  }, '-=0.4');

// ─── Project Cards — Stagger + image parallax ───
gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: (i % 2) * 0.12,
    ease,
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none',
    }
  });

  // Image parallax (Kota style: subtle vertical drift inside card)
  const img = card.querySelector('.project-card__img');
  if (img) {
    gsap.fromTo(img,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  }
});

// ─── Results — Bounce + Counter ───
gsap.utils.toArray('.results__card').forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    scale: 0.92,
    duration: 0.7,
    delay: i * 0.1,
    ease: 'back.out(1.2)',
    scrollTrigger: {
      trigger: '.results__cards',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });
});

// Animated counter
gsap.utils.toArray('.results__stat').forEach((stat) => {
  const text = stat.textContent;
  const numMatch = text.match(/[\d,]+/);

  if (numMatch) {
    const endVal = parseInt(numMatch[0].replace(/,/g, ''));
    const prefix = text.substring(0, text.indexOf(numMatch[0]));
    const suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);

    const counter = { val: 0 };

    gsap.to(counter, {
      val: endVal,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        stat.textContent = prefix + Math.round(counter.val).toLocaleString() + suffix;
      }
    });
  }
});

// ─── Testimonials ───
gsap.from('.testimonials', {
  y: 40, opacity: 0, duration: 0.9, ease,
  scrollTrigger: {
    trigger: '.testimonials',
    start: 'top 80%',
    toggleActions: 'play none none none',
  }
});

// ─── Partners — Cascade pop-in ───
gsap.utils.toArray('.partner-logo').forEach((logo, i) => {
  gsap.from(logo, {
    opacity: 0,
    y: 15,
    duration: 0.4,
    delay: i * 0.04,
    ease,
    scrollTrigger: {
      trigger: '.partners__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });
});

// ─── Article Cards — Stagger reveal ───
gsap.from('.articles__title', {
  yPercent: 60, opacity: 0, duration: 0.8, ease,
  scrollTrigger: {
    trigger: '.articles__header',
    start: 'top 85%',
    toggleActions: 'play none none none',
  }
});

gsap.utils.toArray('.article-card').forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    duration: 0.7,
    delay: i * 0.12,
    ease,
    scrollTrigger: {
      trigger: '.articles__grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  // Image scale scrub
  const img = card.querySelector('.article-card__img');
  if (img) {
    gsap.from(img, {
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }
});

// ─── FAQ ───
gsap.from('.faq__title', {
  yPercent: 60, opacity: 0, duration: 0.8, ease,
  scrollTrigger: {
    trigger: '.faq',
    start: 'top 80%',
    toggleActions: 'play none none none',
  }
});

gsap.utils.toArray('.faq__item').forEach((item, i) => {
  gsap.from(item, {
    y: 25, opacity: 0, duration: 0.5, delay: i * 0.08, ease,
    scrollTrigger: {
      trigger: '.faq__list',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });
});

// ─── Footer ───
gsap.from('.footer__blob-visual', {
  scale: 0, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)',
  scrollTrigger: {
    trigger: '.footer__blob',
    start: 'top 85%',
    toggleActions: 'play none none none',
  }
});

gsap.from('.footer__email', {
  yPercent: 60, opacity: 0, duration: 0.9, ease,
  scrollTrigger: {
    trigger: '.footer__main',
    start: 'top 85%',
    toggleActions: 'play none none none',
  }
});

gsap.from('.footer__social-link', {
  y: 15, opacity: 0, duration: 0.4, stagger: 0.08, ease,
  scrollTrigger: {
    trigger: '.footer__socials',
    start: 'top 90%',
    toggleActions: 'play none none none',
  }
});

gsap.utils.toArray('.pill--dark').forEach((pill, i) => {
  gsap.from(pill, {
    scale: 0, opacity: 0, duration: 0.35, delay: i * 0.04,
    ease: 'back.out(1.8)',
    scrollTrigger: {
      trigger: '.footer__sectors',
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });
});

// ─── Smooth Scroll for Anchor Links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    }
  });
});
