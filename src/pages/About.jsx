import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useGSAP, { gsap } from '../hooks/useGSAP';
import useHeroCanvas from '../hooks/useHeroCanvas';
import ArrowIcon from '../components/ArrowIcon';
import '../styles/about.css';

export default function About() {
  const canvasRef = useHeroCanvas('#f0ede8', 'multiply', 0.2);

  // Floating CTA visibility
  useEffect(() => {
    const handle = () => {
      const el = document.getElementById('floating-cta');
      if (el) el.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const containerRef = useGSAP(() => {
    const ease = 'power3.out';

    // Hero
    gsap.to('.about-page .title-line span', { y: 0, opacity: 1, stagger: 0.1, delay: 0.3, duration: 1.2, ease: 'power4.out' });
    gsap.from('.about-hero__label', { y: 20, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power4.out' });

    // Mission
    gsap.from('.about-mission__headline', { yPercent: 40, opacity: 0, duration: 1, ease, scrollTrigger: { trigger: '.about-mission', start: 'top 75%' } });
    gsap.from('.about-mission__text', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease, scrollTrigger: { trigger: '.about-mission__right', start: 'top 80%' } });

    // Values outline text
    gsap.utils.toArray('.about-values .outline-text').forEach((text) => {
      gsap.from(text, { yPercent: 80, opacity: 0, duration: 1, ease, scrollTrigger: { trigger: text, start: 'top 90%' } });
      gsap.to(text, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: text, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });

    // Value cards
    gsap.utils.toArray('.value-card').forEach((card, i) => {
      gsap.from(card, { y: 50, opacity: 0, duration: 0.7, delay: i * 0.1, ease, scrollTrigger: { trigger: '.about-values__grid', start: 'top 80%' } });
    });

    // Stats
    gsap.utils.toArray('.stat-block').forEach((block, i) => {
      gsap.from(block, { y: 40, opacity: 0, scale: 0.92, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.about-stats', start: 'top 80%' } });
    });

    // Services
    gsap.from('.about-services__title', { yPercent: 40, opacity: 0, duration: 0.8, ease, scrollTrigger: { trigger: '.about-services__header', start: 'top 85%' } });
    gsap.utils.toArray('.about-service-item').forEach((item, i) => {
      gsap.from(item, { y: 40, opacity: 0, duration: 0.6, delay: i * 0.1, ease, scrollTrigger: { trigger: '.about-services__grid', start: 'top 80%' } });
    });

    // CTA
    gsap.from('.about-cta__title', { yPercent: 50, opacity: 0, duration: 1, ease, scrollTrigger: { trigger: '.about-cta', start: 'top 80%' } });

    // Footer blob
    const footerBlob = document.querySelector('.footer__blob-visual');
    if (footerBlob) {
      gsap.from(footerBlob, { scale: 0, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)', scrollTrigger: { trigger: '.footer__blob', start: 'top 85%' } });
      gsap.to(footerBlob, { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.footer__blob', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }
  });

  const values = [
    { num: '01', title: 'Strategy First', desc: "We don't guess — we research, analyse, and plan. Every campaign is built on a foundation of data, market research, and a deep understanding of your audience and competitive landscape. Strategy is always step one." },
    { num: '02', title: 'Creative Impact', desc: "Great design and copy don't just look good — they communicate. We craft visuals, videos, and content that stop the scroll, spark genuine emotion, and drive meaningful action from your target audience." },
    { num: '03', title: 'Honest Results', desc: "No vanity metrics. No smoke and mirrors. We track the numbers that actually matter — leads generated, conversions achieved, and real ROI. If something isn't working, we tell you — and we fix it." },
    { num: '04', title: 'True Partnership', desc: "We're not a vendor — we're an extension of your team. We communicate openly, share knowledge, and celebrate your wins as our own. Your growth is genuinely our mission, not just a line in a pitch deck." },
  ];

  const serviceIcons = [
    <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></>,
    <><path d="M12 20V10M18 20V4M6 20v-4"/></>,
    <><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>,
    <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
    <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></>,
    <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
  ];

  const serviceNames = ['Social Media Management', 'Search Engine Optimization', 'Website Development', 'Google and Meta Ads', 'Content Writing', 'Video Editing', 'Graphic Designing', 'Photoshoot'];
  const serviceDescs = [
    'Strategic content, community engagement, and brand consistency that turns followers into customers.',
    'Research-backed SEO that drives organic traffic, improves rankings, and brings high-intent visitors month after month.',
    'Conversion-focused, responsive websites built to attract visitors and turn traffic into loyal customers.',
    'ROI-driven paid advertising across Google and Meta to scale visibility and generate quality leads.',
    'Compelling, SEO-optimised content — from blogs to ad copy — that tells your story and drives action.',
    'Professional video editing for social reels, brand films, product videos, and motion graphics.',
    "Eye-catching design — logos, social creatives, print collaterals, and UI/UX that builds your brand.",
    'Professional photography for products, brand identity, events, and lifestyle imagery.',
  ];

  return (
    <div className="about-page" ref={containerRef}>
      {/* HERO */}
      <section className="about-hero" data-theme="light">
        <div className="about-hero__bg"><canvas ref={canvasRef}></canvas></div>
        <div className="about-hero__content">
          <h1 className="about-hero__title">
            <div className="title-line"><span>Proudly</span></div>
            <div className="title-line"><span>crafting</span></div>
            <div className="title-line"><span>digital</span> <span>growth.</span></div>
          </h1>
          <div className="about-hero__label">| agency</div>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-mission" data-theme="light">
        <div className="about-mission__inner">
          <div className="about-mission__left">
            <h2 className="about-mission__headline">To make digital marketing simple, transparent, and genuinely effective for Indian businesses — so that more brands can grow with confidence online.</h2>
          </div>
          <div className="about-mission__right">
            <p className="about-mission__text">Blooming Hives is a Delhi-based creative agency built for businesses that want more than just a social media presence. We combine data-driven strategy with bold creative thinking to help brands grow — and we work with clients across India.</p>
            <p className="about-mission__text">Every brand has a story worth telling. Our job is to make sure the right people hear it — through SEO that drives organic traffic, paid ads that convert, social content that builds community, and websites that don't just look great, they perform.</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="about-values__header">
          <span className="outline-text reveal">OUR</span>
          <span className="outline-text outline-text--indent reveal">VALUES</span>
        </div>
        <div className="about-values__grid">
          {values.map(v => (
            <div className="value-card reveal" key={v.num}>
              <span className="value-card__number">{v.num}</span>
              <h3 className="value-card__title">{v.title}</h3>
              <p className="value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats">
        <div className="about-stats__inner">
          {[{ val: '100+', label: 'Leads generated' }, { val: '4.9 ★', label: 'Avg. Client Rating' }, { val: '90%', label: 'Client retention rate' }, { val: '8+', label: 'Services Offered' }].map((s, i) => (
            <div className="stat-block reveal" key={i}>
              <div className="stat-block__value">{s.val}</div>
              <div className="stat-block__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="about-services" data-theme="light">
        <div className="about-services__header">
          <h2 className="about-services__title">What we do</h2>
          <p className="about-services__subtitle">End-to-end digital marketing that delivers measurable growth.</p>
        </div>
        <div className="about-services__grid">
          {serviceNames.map((name, i) => (
            <div className="about-service-item reveal" key={i}>
              <div className="about-service-item__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{serviceIcons[i]}</svg>
              </div>
              <h3>{name}</h3>
              <p>{serviceDescs[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2 className="about-cta__title">Ready to make your brand bloom?</h2>
          <Link to="/contact" className="btn-pill btn-pill--outline btn-pill--light">
            <span>Start Your Project</span>
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
