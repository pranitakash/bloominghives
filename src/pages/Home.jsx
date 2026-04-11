import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useGSAP, { gsap, ScrollTrigger } from '../hooks/useGSAP';
import ArrowIcon from '../components/ArrowIcon';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const trackRef = useRef(null);
  const totalSlides = 3;

  // ─── Testimonials auto-slide ───
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      gsap.to(trackRef.current, { x: `-${currentSlide * 100}%`, duration: 0.8, ease: 'power3.out' });
    }
  }, [currentSlide]);

  // ─── FAQ state ───
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  // ─── GSAP Scroll Animations ───
  const containerRef = useGSAP(() => {
    const ease = 'power3.out';

    // Hero entrance — delay gives the browser time to paint layout + canvas first
    const heroTl = gsap.timeline({ defaults: { ease } });
    heroTl
      .from('.hero__line:nth-child(1)', { yPercent: 100, opacity: 0, duration: 1.2, delay: 0.5 })
      .from('.hero__line:nth-child(2)', { yPercent: 100, opacity: 0, duration: 1.2 }, '-=0.85')
      .from('.hero__line:nth-child(3)', { yPercent: 100, opacity: 0, duration: 1.2 }, '-=0.85')
      .from('.hero__sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero__badge', { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .from('.hero__o-visual', { scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=1');

    // Services intro
    gsap.from('.services-intro__desc', { y: 30, opacity: 0, duration: 0.9, ease, scrollTrigger: { trigger: '.services-intro', start: 'top 70%' } });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i, arr) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%' } });
      const title = card.querySelector('.service-card__title');
      const pills = card.querySelectorAll('.pill');
      const desc = card.querySelector('.service-card__desc');
      const btn = card.querySelector('.btn-pill');
      if (title) tl.from(title, { yPercent: 60, opacity: 0, duration: 0.7, ease });
      if (pills.length) tl.from(pills, { y: 12, opacity: 0, duration: 0.4, stagger: 0.05, ease }, '-=0.35');
      if (desc) tl.from(desc, { y: 15, opacity: 0, duration: 0.5, ease }, '-=0.25');
      if (btn) tl.from(btn, { y: 12, opacity: 0, duration: 0.4, ease }, '-=0.2');

      const img = card.querySelector('.service-card__img');
      if (img) gsap.from(img, { scale: 1.15, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 80%', end: 'bottom 30%', scrub: 1 } });
      if (i < arr.length - 1) gsap.to(card, { scale: 0.95, scrollTrigger: { trigger: arr[i + 1], start: 'top bottom', end: 'top 10%', scrub: 0.5 } });
    });

    // Approach blocks
    gsap.utils.toArray('.approach__block').forEach((block) => {
      const isRight = block.classList.contains('approach__block--right');
      const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 80%' } });
      tl.from(block.querySelector('.approach__number'), { y: -15, opacity: 0, duration: 0.5, ease })
        .from(block.querySelector('.approach__title'), { x: isRight ? 60 : -60, opacity: 0, duration: 0.8, ease }, '-=0.3')
        .from(block.querySelector('.approach__desc'), { y: 20, opacity: 0, duration: 0.6, ease }, '-=0.3');
    });

    // Outline text
    gsap.utils.toArray('.outline-text').forEach((text) => {
      gsap.from(text, { yPercent: 80, opacity: 0, duration: 1, ease, scrollTrigger: { trigger: text, start: 'top 90%' } });
      gsap.to(text, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: text, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });

    // Work intro
    const workTl = gsap.timeline({ scrollTrigger: { trigger: '.work-intro__right', start: 'top 80%' } });
    workTl.from('.work-intro__heading', { yPercent: 50, opacity: 0, duration: 0.9, ease })
      .from('.work-intro__desc', { y: 25, opacity: 0, duration: 0.7, ease }, '-=0.4');

    // Project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, { y: 50, opacity: 0, duration: 0.8, delay: (i % 2) * 0.12, ease, scrollTrigger: { trigger: card, start: 'top 85%' } });
      const img = card.querySelector('.project-card__img');
      if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });

    // Results cards
    gsap.utils.toArray('.results__card').forEach((card, i) => {
      gsap.from(card, { y: 50, opacity: 0, scale: 0.92, duration: 0.7, delay: i * 0.1, ease: 'back.out(1.2)', scrollTrigger: { trigger: '.results__cards', start: 'top 80%' } });
    });

    // Animated counters
    gsap.utils.toArray('.results__stat').forEach((stat) => {
      const text = stat.textContent;
      const numMatch = text.match(/[\d,]+/);
      if (numMatch) {
        const endVal = parseInt(numMatch[0].replace(/,/g, ''));
        const prefix = text.substring(0, text.indexOf(numMatch[0]));
        const suffix = text.substring(text.indexOf(numMatch[0]) + numMatch[0].length);
        const counter = { val: 0 };
        gsap.to(counter, { val: endVal, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: stat, start: 'top 85%' }, onUpdate: () => { stat.textContent = prefix + Math.round(counter.val).toLocaleString() + suffix; } });
      }
    });

    // Testimonials
    gsap.from('.testimonials', { y: 40, opacity: 0, duration: 0.9, ease, scrollTrigger: { trigger: '.testimonials', start: 'top 80%' } });

    // Partners
    gsap.utils.toArray('.partner-logo').forEach((logo, i) => {
      gsap.from(logo, { opacity: 0, y: 15, duration: 0.4, delay: i * 0.04, ease, scrollTrigger: { trigger: '.partners__grid', start: 'top 80%' } });
    });

    // Articles
    gsap.from('.articles__title', { yPercent: 60, opacity: 0, duration: 0.8, ease, scrollTrigger: { trigger: '.articles__header', start: 'top 85%' } });
    gsap.utils.toArray('.article-card').forEach((card, i) => {
      gsap.from(card, { y: 50, opacity: 0, duration: 0.7, delay: i * 0.12, ease, scrollTrigger: { trigger: '.articles__grid', start: 'top 80%' } });
      const img = card.querySelector('.article-card__img');
      if (img) gsap.from(img, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });

    // FAQ
    gsap.from('.faq__title', { yPercent: 60, opacity: 0, duration: 0.8, ease, scrollTrigger: { trigger: '.faq', start: 'top 80%' } });
    gsap.utils.toArray('.faq__item').forEach((item, i) => {
      gsap.from(item, { y: 25, opacity: 0, duration: 0.5, delay: i * 0.08, ease, scrollTrigger: { trigger: '.faq__list', start: 'top 80%' } });
    });

    // Footer
    gsap.from('.footer__globe', { y: 40, opacity: 0, duration: 1.2, ease, scrollTrigger: { trigger: '.footer__globe', start: 'top 85%' } });
    gsap.from('.footer__email', { yPercent: 60, opacity: 0, duration: 0.9, ease, scrollTrigger: { trigger: '.footer__main', start: 'top 85%' } });
    gsap.from('.footer__social-link', { y: 15, opacity: 0, duration: 0.4, stagger: 0.08, ease, scrollTrigger: { trigger: '.footer__socials', start: 'top 90%' } });
    gsap.utils.toArray('.pill--dark').forEach((pill, i) => {
      gsap.from(pill, { scale: 0, opacity: 0, duration: 0.35, delay: i * 0.04, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.footer__sectors', start: 'top 90%' } });
    });
  });

  // ─── Header scroll state ───
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const header = document.getElementById('site-header');
        const floatingCta = document.getElementById('floating-cta');
        if (header) header.classList.toggle('scrolled', window.scrollY > 80);
        if (floatingCta) floatingCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqData = [
    { q: 'How much do your digital marketing services cost?', a: 'Our packages start from ₹15,000 per month and go up to ₹2,00,000+ depending on scope. We offer flexible plans for social media management, SEO, paid ads, and full-service digital marketing. Get in touch for a custom quote tailored to your business goals.' },
    { q: 'How long before I see results from digital marketing?', a: 'Paid campaigns on Google and Meta typically show measurable results within 2–4 weeks. SEO and organic growth take 3–6 months to build meaningful traction. We set clear milestones at every stage so you always know what to expect.' },
    { q: 'Can you work with tight deadlines?', a: "Absolutely. We're built for speed without compromising quality. Whether it's an urgent campaign launch, a website build, or last-minute creative — we mobilise our team to meet your timeline." },
    { q: 'Do you provide support after campaign launch?', a: 'Yes — think of us as your extended marketing team. We offer ongoing management, optimisation, A/B testing, and monthly reporting so your campaigns keep improving over time.' },
    { q: 'How involved do I need to be?', a: "As much or as little as you'd like. We handle the strategy, execution, and reporting. But we always welcome your input, and our process is built on transparency and regular communication." },
    { q: 'Can I combine multiple services?', a: 'Absolutely — and we recommend it. Integrated campaigns (ads + SEO + social) consistently outperform single-channel approaches. We build custom packages around your goals and budget.' },
  ];

  const serviceCards = [
    { id: 'service-smm', title: 'Social Media Management', pills: ['Content Strategy', 'Community Management', 'Brand Consistency', 'Audience Engagement'], desc: 'We grow your brand\'s social presence with scroll-stopping content, strategic planning, and hands-on community management — turning followers into loyal customers.', link: '/service/smm', img: '/assets/images/service-social.png', imgAlt: 'Social Media Management - content planning and engagement' },
    { id: 'service-seo', title: 'Search Engine Optimization', pills: ['Technical SEO', 'On-page SEO', 'Keyword Research', 'Link Building'], desc: 'Research-backed SEO strategies that push you up the rankings, drive high-intent organic traffic, and keep your brand visible month after month.', link: '/service/seo', img: '/assets/images/service-performance.png', imgAlt: 'Search Engine Optimization analytics and rankings' },
    { id: 'service-web', title: 'Website Development', pills: ['WordPress', 'Custom Development', 'Responsive Design', 'E-commerce'], desc: 'Fast, conversion-focused websites built to turn visitors into customers. From landing pages to full e-commerce stores — responsive and results-driven.', link: '/service/webdev', img: '/assets/images/service-website.png', imgAlt: 'Website Development - responsive designs on multiple devices' },
    { id: 'service-ads', title: 'Google and Meta Ads', pills: ['Google Ads', 'Meta Ads', 'Retargeting', 'Lead Generation'], desc: 'ROI-driven paid advertising campaigns across Google and Meta that scale your visibility, generate quality leads, and grow revenue confidently.', link: '/service/ads', img: '/assets/images/service-performance.png', imgAlt: 'Google and Meta Ads - performance dashboard' },
    { id: 'service-content', title: 'Content Writing', pills: ['Blog Posts', 'Website Copy', 'Ad Copy', 'Social Captions'], desc: 'Compelling, SEO-optimised content that tells your brand story, builds authority, and drives conversions — from web copy and blogs to ad scripts.', link: '/service/content', img: '/assets/images/service-social.png', imgAlt: 'Content Writing - compelling copy and blog content' },
    { id: 'service-video', title: 'Video Editing', pills: ['Reels & Shorts', 'Promotional Videos', 'Motion Graphics', 'Product Videos'], desc: 'Professional video editing that stops the scroll — from high-energy Instagram reels to polished brand films and product videos.', link: '/service/video', img: '/assets/images/service-social.png', imgAlt: 'Video Editing - reels, shorts, and promotional videos' },
    { id: 'service-graphic', title: 'Graphic Designing', pills: ['Brand Identity', 'Social Creatives', 'Print Design', 'UI/UX Design'], desc: 'Eye-catching design that communicates your brand instantly — logos, social creatives, print collaterals, and everything in between.', link: '/service/graphic', img: '/assets/images/service-website.png', imgAlt: 'Graphic Designing - brand identity and creative designs' },
    { id: 'service-photoshoot', title: 'Photoshoot', pills: ['Product Photography', 'Brand Shoots', 'Event Coverage', 'Lifestyle'], desc: 'Professional photography that brings your brand to life — product shots, brand photoshoots, events, and lifestyle imagery that sells.', link: '/service/photoshoot', img: '/assets/images/service-performance.png', imgAlt: 'Photoshoot - professional brand and product photography' },
  ];

  const projects = [
    { id: 'project-1', name: 'Restaurant Brand Campaign', year: '2025', img: '/assets/images/project-restaurant.png', alt: 'Restaurant brand campaign', tags: ['Social Media', 'Branding'], full: true },
    { id: 'project-2', name: 'Real Estate Lead Gen', year: '2025', img: '/assets/images/project-realestate.png', alt: 'Real estate lead generation' },
    { id: 'project-3', name: 'E-Commerce Growth', year: '2024', img: '/assets/images/project-ecommerce.png', alt: 'E-commerce growth' },
    { id: 'project-4', name: 'Event Marketing', year: '2024', img: '/assets/images/project-event.png', alt: 'Event marketing' },
    { id: 'project-5', name: 'Healthcare Brand', year: '2024', img: '/assets/images/project-healthcare.png', alt: 'Healthcare brand' },
  ];

  const resultsData = [
    { stat: '100+', label: 'Qualified Leads Generated', context: 'Delivering high-intent prospects and consistent growth for our clients across competitive industries.', icon: '/assets/images2/leads_growth_icon.png' },
    { stat: '4.9 ★', label: 'Average Client Rating', context: 'Our clients love our dedication, creative solutions, and the tangible impact we bring to their growing brands.', icon: '/assets/images2/star_rating_icon.png' },
    { stat: '90%', label: 'Client Retention Rate', context: 'Building long-term partnerships through consistent results and transparent communication.', icon: '/assets/images2/retention_partner_icon.png' },
    { stat: '3x', label: 'Average Engagement Increase', context: 'We consistently deliver measurable improvements in social reach and audience interaction across all platforms.', icon: '/assets/images2/roi_analytics_icon.png' },
  ];

  const testimonials = [
    "Blooming Hives completely transformed our online presence. Within the first two months of running our Meta ads campaign, we were getting more qualified enquiries than ever before. Highly recommend.",
    "The team handles everything — from our Instagram content to our Google Ads — and the results speak for themselves. Responsive, creative, and genuinely invested in our growth.",
    "Their SEO work has made a real difference to our organic traffic. We're now ranking on page one for keywords we never thought we'd reach. Worth every rupee.",
  ];

  const partners = ['Client Brand', 'Partner Co.', 'Brand Studio', 'Growth Inc.', 'MediaWorks', 'TechScale', 'NextLevel', 'BrandFirst', 'AdVenture', 'Starter Co.', 'LeadMax', 'DesignHub', 'ReachOut', 'MarketPro', 'PixelCraft'];

  return (
    <div ref={containerRef}>
      {/* HERO */}
      <section className="hero" id="hero" data-theme="light">
        <div className="hero__gradient-bg"></div>
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__line">bloom</span>
            <span className="hero__line hero__line--indent">beyond</span>
            <span className="hero__line">b<span className="hero__o-wrap"><span className="hero__o-visual"><video className="hero__o-video" id="hero-o-video" autoPlay muted loop playsInline><source src="/assets/videos/hero-reel.mp4" type="video/mp4" /></video></span></span>ring</span>
          </h1>
          <div className="hero__sub">
            <p className="hero__description">Blooming Hives is a creative digital marketing agency based in Delhi, India. We build brands that refuse to blend in — with SEO, social media, paid ads, websites, and content that actually converts.</p>
          </div>
        </div>
        <div className="hero__badges">
          <div className="hero__badge"><span className="hero__badge-icon">★</span><span className="hero__badge-text">5-Star Rated</span></div>
          <div className="hero__badge"><span className="hero__badge-icon">◆</span><span className="hero__badge-text">Pan-India Clients</span></div>
          <div className="hero__badge"><span className="hero__badge-icon">●</span><span className="hero__badge-text">Google Partner</span></div>
        </div>
      </section>

      {/* SERVICES INTRO */}
      <section className="services-intro" id="services">
        <div className="services-intro__content">
          <span className="outline-text reveal">WHAT</span>
          <span className="outline-text outline-text--indent reveal">WE DO</span>
        </div>
        <div className="services-intro__right reveal">
          <p className="services-intro__desc">We combine strategy, creativity, and data to deliver marketing that doesn't just look good — it <strong>works hard.</strong> Whether you're a startup finding your footing or an established brand ready to scale, we've got the playbook.</p>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="services" id="services-cards" data-theme="light">
        {serviceCards.map((s, i) => (
          <div className="service-card" id={s.id} key={s.id}>
            <div className="service-card__content">
              <h2 className="service-card__title">{s.title}</h2>
              <div className="service-card__pills">{s.pills.map(p => <span className="pill" key={p}>{p}</span>)}</div>
              <p className="service-card__desc">{s.desc}</p>
              <Link to={s.link} className="btn-pill btn-pill--outline"><span>Find out more</span><ArrowIcon /></Link>
            </div>
            <div className="service-card__visual" id={`service-visual-${i + 1}`}>
              <img src={s.img} alt={s.imgAlt} className="service-card__img" loading="lazy" />
            </div>
          </div>
        ))}
      </section>

      {/* APPROACH */}
      <section className="approach" id="about">
        {[
          { num: '01/', title: 'Strategy with purpose.', desc: 'We build data-driven, brand-led digital strategies designed to deliver results. Every campaign starts with research — market analysis, competitor benchmarking, and a deep understanding of your audience — before a single creative is made.', img: '/assets/images2/illus1.png', alt: 'Strategy illustration' },
          { num: '02/', title: 'Nail the process.', desc: "We're collaborative, decisive, and clear from day one. You'll always know where your campaigns stand, what's performing, and what we're doing next. No black boxes. No surprises. Just momentum.", img: '/assets/images2/illus2.png', alt: 'Process illustration', right: true },
          { num: '03/', title: 'Built to scale.', desc: "We grow with you. Whether you're launching your first campaign or scaling a proven one, our strategies are built to flex — so your digital presence scales as fast as your ambitions.", img: '/assets/images2/illus3.png', alt: 'Scale illustration' },
          { num: '04/', title: 'Create to convert.', desc: "Every visual, every word, every ad — built with conversion in mind. We track what matters (leads, revenue, ROI) and optimise relentlessly to make sure your budget works as hard as you do.", img: '/assets/images2/illus4.png', alt: 'Convert illustration', right: true },
        ].map((b, i) => (
          <div className={`approach__block${b.right ? ' approach__block--right' : ''} reveal`} key={i}>
            {b.right && <div className="approach__visual"><img src={b.img} alt={b.alt} className="approach__img" loading="lazy" /></div>}
            <div className="approach__text">
              <span className="approach__number">{b.num}</span>
              <h3 className="approach__title">{b.title}</h3>
              <p className="approach__desc">{b.desc}</p>
            </div>
            {!b.right && <div className="approach__visual"><img src={b.img} alt={b.alt} className="approach__img" loading="lazy" /></div>}
          </div>
        ))}
      </section>

      {/* OUR WORK INTRO */}
      <section className="work-intro" id="work">
        <div className="work-intro__left">
          <span className="outline-text reveal">OUR</span>
          <span className="outline-text outline-text--indent reveal">WORK</span>
        </div>
        <div className="work-intro__right reveal">
          <h2 className="work-intro__heading">Making brands bloom like never before.</h2>
          <p className="work-intro__desc">Let's face it, first impressions matter. Your digital presence is an opportunity to wow your audience, so why choose mediocre marketing? Brands win over fans when they're brave enough to go beyond their creative comfort zone.</p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects" id="projects">
        {projects.filter(p => p.full).map(p => (
          <a href="#" className="project-card project-card--full reveal" id={p.id} key={p.id}>
            <div className="project-card__header">
              <div className="project-card__arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg></div>
              <span className="project-card__name">{p.name}</span>
              <span className="project-card__year">{p.year}</span>
            </div>
            <div className="project-card__image"><img src={p.img} alt={p.alt} className="project-card__img" loading="lazy" /></div>
            {p.tags && <div className="project-card__meta">{p.tags.map(t => <span className="project-tag" key={t}>{t}</span>)}</div>}
          </a>
        ))}
        <div className="projects__grid">
          {projects.filter(p => !p.full).map(p => (
            <a href="#" className="project-card reveal" id={p.id} key={p.id}>
              <div className="project-card__header">
                <div className="project-card__arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg></div>
                <span className="project-card__name">{p.name}</span>
                <span className="project-card__year">{p.year}</span>
              </div>
              <div className="project-card__image"><img src={p.img} alt={p.alt} className="project-card__img" loading="lazy" /></div>
            </a>
          ))}
        </div>
        <div className="projects__cta reveal">
          <a href="https://bloominghives.in/portfolio/" className="btn-pill btn-pill--outline btn-pill--light"><span>View all projects</span><ArrowIcon /></a>
        </div>
      </section>

      {/* RESULTS */}
      <section className="results" id="results">
        <div className="results__header">
          <span className="outline-text reveal">OUR</span>
          <span className="outline-text outline-text--indent reveal">RESULTS</span>
        </div>
        <div className="results__cards">
          {resultsData.map((r, i) => (
            <div className="results__card reveal" key={i}>
              <img src={r.icon} alt={`${r.label} Icon`} className="results__card-img" loading="lazy" />
              <div className="results__stat">{r.stat}</div>
              <div className="results__label">{r.label}</div>
              <p className="results__context">{r.context}</p>
              <div className="results__gradient-arc"></div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="testimonials__track" id="testimonials-track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <div className="testimonial-slide" key={i}>
              <blockquote className="testimonial__quote">"{t}"</blockquote>
              <a href="#" className="btn-pill btn-pill--outline btn-pill--light btn-pill--small"><span>View project</span><ArrowIcon size={14} /></a>
            </div>
          ))}
        </div>
        <div className="testimonials__nav">
          <button className="testimonials__btn" onClick={() => setCurrentSlide(prev => prev <= 0 ? totalSlides - 1 : prev - 1)} aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>
          </button>
          <button className="testimonials__btn" onClick={() => setCurrentSlide(prev => (prev + 1) % totalSlides)} aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="partners" id="partners">
        <div className="partners__header">
          <span className="outline-text reveal">OUR</span>
          <span className="outline-text outline-text--indent reveal">PARTNERS</span>
        </div>
        <div className="partners__grid reveal">
          {partners.map(p => <div className="partner-logo" key={p}>{p}</div>)}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="articles" id="blog" data-theme="light">
        <div className="articles__header reveal">
          <h2 className="articles__title">Latest articles</h2>
          <a href="https://bloominghives.in/blog/" className="btn-pill btn-pill--outline btn-pill--light"><span>View our blog</span><ArrowIcon /></a>
        </div>
        <div className="articles__grid">
          {[
            { img: '/assets/images/article-meta-ads.png', alt: '5 Meta Ads Strategies', cat: 'PERFORMANCE MARKETING', title: '5 Meta Ads Strategies That Actually Work in 2025' },
            { img: '/assets/images/article-social-media.png', alt: 'Social Media Strategy', cat: 'SOCIAL MEDIA', title: 'Why Your Brand Needs a Social Media Strategy, Not Just Posts' },
            { img: '/assets/images/article-seo.png', alt: 'SEO in 2025', cat: 'SEO', title: "SEO in 2025: What's Changed and What Still Matters" },
          ].map((a, i) => (
            <article className="article-card reveal" id={`article-${i + 1}`} key={i}>
              <div className="article-card__image"><img src={a.img} alt={a.alt} className="article-card__img" loading="lazy" /></div>
              <div className="article-card__body">
                <span className="article-card__category">{a.cat}</span>
                <h3 className="article-card__title">{a.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2 className="faq__title reveal">FAQ's</h2>
        <div className="faq__list">
          {faqData.map((f, i) => (
            <div className={`faq__item reveal${openFaq === i ? ' open' : ''}`} id={`faq-${i + 1}`} key={i}>
              <button className="faq__question" aria-expanded={openFaq === i} onClick={() => toggleFaq(i)}>
                <span className="faq__icon">+</span>
                <span>{f.q}</span>
              </button>
              <div className="faq__answer"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
