/* ═══════════════════════════════════════════════════
   BLOOMING HIVES — Service Page Script
   GSAP animations + smooth scrolling + header
   Light-theme KOTA-inspired service pages
   ═══════════════════════════════════════════════════ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll with Lenis ──
async function initLenis() {
  try {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
  } catch (e) {
    console.log('Lenis not available, using native scroll');
  }
}

// ── Header logic ──
function initHeader() {
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const curr = window.scrollY;
    header.classList.toggle('header--hidden', curr > lastScroll && curr > 100);
    header.classList.toggle('header--scrolled', curr > 50);
    lastScroll = curr;
  }, { passive: true });

  if (menuToggle && menuOverlay) {
    let backdrop = document.querySelector('.menu-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'menu-backdrop';
      document.body.appendChild(backdrop);
    }

    function toggleMenu() {
      const isOpen = menuOverlay.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      backdrop.classList.toggle('visible', isOpen);
    }

    menuToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    const parentLis = menuOverlay.querySelectorAll('.menu-overlay__list > li');
    parentLis.forEach(li => {
      const link = li.querySelector('.menu-overlay__link');
      const sublist = li.querySelector('.menu-overlay__sublist');
      if (link && sublist) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          li.classList.toggle('expanded');
        });
      }
    });
  }
}

// ── Hero title animation ──
function animateHero() {
  const lines = document.querySelectorAll('.service-hero__title .title-line span');
  const eyebrow = document.querySelector('.service-hero__eyebrow');
  const subtitle = document.querySelector('.service-hero__subtitle');
  const heroImage = document.querySelector('.service-hero__image');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (eyebrow) {
    tl.fromTo(eyebrow, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0);
  }

  lines.forEach((line, i) => {
    tl.fromTo(line,
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1.1, ease: 'power4.out' },
      0.15 + i * 0.12
    );
  });

  if (subtitle) {
    tl.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.5);
  }

  if (heroImage) {
    tl.fromTo(heroImage,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' },
      0.2
    );
  }
}

// ── Scroll reveal animations ──
function initScrollReveal() {
  // Service nav pills
  gsap.utils.toArray('.service-nav__pill').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        delay: i * 0.05 }
    );
  });

  // Showcase cards
  gsap.utils.toArray('.showcase-card').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        delay: i * 0.1 }
    );
  });

  // Intro section
  const introTitle = document.querySelector('.service-intro__title');
  const introDesc = document.querySelector('.service-intro__desc');
  if (introTitle) {
    gsap.fromTo(introTitle,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: introTitle, start: 'top 80%' } }
    );
  }
  if (introDesc) {
    gsap.fromTo(introDesc,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: introDesc, start: 'top 82%' },
        delay: 0.15 }
    );
  }

  // Z-pattern detail sections
  gsap.utils.toArray('.service-detail').forEach(section => {
    const text = section.querySelector('.service-detail__text');
    const visual = section.querySelector('.service-detail__visual');

    if (text) {
      gsap.fromTo(text,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' } }
      );
    }
    if (visual) {
      gsap.fromTo(visual,
        { x: 40, opacity: 0, scale: 0.92 },
        { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' } }
      );
    }
  });

  // Results stats — count up animation
  gsap.utils.toArray('.service-results__stat').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });

  // Workflow cards
  gsap.utils.toArray('.workflow-card').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        delay: i * 0.1 }
    );
  });

  // Timeline
  gsap.utils.toArray('.timeline-marker').forEach((el, i) => {
    gsap.fromTo(el,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.12 }
    );
  });

  gsap.utils.toArray('.timeline-line').forEach(el => {
    gsap.fromTo(el,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' } }
    );
  });

  // CTA section
  const ctaTitle = document.querySelector('.service-cta__title');
  if (ctaTitle) {
    gsap.fromTo(ctaTitle,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ctaTitle, start: 'top 80%' } }
    );
  }

  // Other services cards
  gsap.utils.toArray('.other-services__card').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        delay: i * 0.06 }
    );
  });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initHeader();
  animateHero();
  initScrollReveal();
});
