import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import useGSAP, { gsap } from '../hooks/useGSAP';
import ArrowIcon from '../components/ArrowIcon';
import services, { serviceNavItems } from '../data/services';
import '../styles/service.css';

export default function Service() {
  const { slug } = useParams();
  const data = services[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
    const heroLines = document.querySelectorAll('.service-hero__title .title-line span');
    const eyebrow = document.querySelector('.service-hero__eyebrow');
    const subtitle = document.querySelector('.service-hero__subtitle');
    const heroImage = document.querySelector('.service-hero__image');

    const heroTl = gsap.timeline({ defaults: { ease } });
    if (eyebrow) heroTl.fromTo(eyebrow, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0);
    heroLines.forEach((line, i) => {
      heroTl.fromTo(line, { y: '110%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.1, ease: 'power4.out' }, 0.15 + i * 0.12);
    });
    if (subtitle) heroTl.fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.5);
    if (heroImage) heroTl.fromTo(heroImage, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, 0.2);

    // Nav pills
    gsap.utils.toArray('.service-nav__pill').forEach((el, i) => {
      gsap.fromTo(el, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease, delay: i * 0.05, scrollTrigger: { trigger: el, start: 'top 92%' } });
    });

    // Showcase
    gsap.utils.toArray('.showcase-card').forEach((el, i) => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease, delay: i * 0.1, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Intro
    const introTitle = document.querySelector('.service-intro__title');
    const introDesc = document.querySelector('.service-intro__desc');
    if (introTitle) gsap.fromTo(introTitle, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease, scrollTrigger: { trigger: introTitle, start: 'top 80%' } });
    if (introDesc) gsap.fromTo(introDesc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease, delay: 0.15, scrollTrigger: { trigger: introDesc, start: 'top 82%' } });

    // Detail sections
    gsap.utils.toArray('.service-detail').forEach(section => {
      const text = section.querySelector('.service-detail__text');
      const visual = section.querySelector('.service-detail__visual');
      if (text) gsap.fromTo(text, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease, scrollTrigger: { trigger: section, start: 'top 70%' } });
      if (visual) gsap.fromTo(visual, { x: 40, opacity: 0, scale: 0.92 }, { x: 0, opacity: 1, scale: 1, duration: 1.1, ease, scrollTrigger: { trigger: section, start: 'top 70%' } });
    });

    // Results
    gsap.utils.toArray('.service-results__stat').forEach(el => {
      gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });

    // Workflow
    gsap.utils.toArray('.workflow-card').forEach((el, i) => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease, delay: i * 0.1, scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    gsap.utils.toArray('.timeline-marker').forEach((el, i) => {
      gsap.fromTo(el, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: i * 0.12, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    gsap.utils.toArray('.timeline-line').forEach(el => {
      gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // CTA
    const ctaTitle = document.querySelector('.service-cta__title');
    if (ctaTitle) gsap.fromTo(ctaTitle, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease, scrollTrigger: { trigger: ctaTitle, start: 'top 80%' } });

    // Other services
    gsap.utils.toArray('.other-services__card').forEach((el, i) => {
      gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease, delay: i * 0.06, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Footer
    const footerBlob = document.querySelector('.footer__blob-visual');
    if (footerBlob) {
      gsap.from(footerBlob, { scale: 0, opacity: 0, duration: 1.5, ease: 'elastic.out(1, 0.4)', scrollTrigger: { trigger: '.footer__blob', start: 'top 85%' } });
    }
  }, [slug]);

  if (!data) return <Navigate to="/" replace />;

  return (
    <div className="service-page" ref={containerRef} key={slug}>
      {/* HERO */}
      <section className="service-hero">
        <div className="service-hero__image">
          <img src={data.heroImage} alt={data.heroImageAlt} />
        </div>
        <div className="service-hero__content">
          <div className="service-hero__left">
            <span className="service-hero__eyebrow">{data.heroEyebrow}</span>
            <h1 className="service-hero__title">
              {data.heroTitle.map((line, i) => <div className="title-line" key={i}><span>{line}</span></div>)}
            </h1>
          </div>
          <div className="service-hero__right">
            <p className="service-hero__subtitle">{data.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* NAV */}
      <div className="service-nav">
        <span className="service-nav__label">Discover more</span>
        <div className="service-nav__pills">
          {serviceNavItems.map(s => (
            <Link key={s.slug} to={`/service/${s.slug}`} className={`service-nav__pill${s.slug === slug ? ' active' : ''}`}>{s.label}</Link>
          ))}
        </div>
      </div>

      {/* SHOWCASE */}
      <section className="service-showcase">
        <div className="service-showcase__grid">
          {data.showcaseImages.map((item, i) => (
            <div className={`showcase-card ${item.className || ''}`} key={i}>
              {item.src ? <img src={item.src} alt={item.alt} loading="lazy" /> : <p>{item.text}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="service-intro">
        <h2 className="service-intro__title">{data.introTitle}</h2>
        <p className="service-intro__desc">{data.introDesc}</p>
      </section>

      {/* DETAILS */}
      {data.details.map((d, i) => (
        <section key={i} className={`service-detail service-detail--${d.color}${d.reverse ? ' service-detail--reverse' : ''}`}>
          <div className="service-detail__text">
            <h3 className="service-detail__title">{d.title}</h3>
            <p className="service-detail__desc">{d.desc}</p>
            <Link to="/contact" className="service-detail__link">
              Start your project
              <ArrowIcon />
            </Link>
          </div>
          <div className="service-detail__visual">
            <div className="service-detail__bg"></div>
            <img src={d.image} alt={d.imageAlt} loading="lazy" />
          </div>
        </section>
      ))}

      {/* RESULTS */}
      <section className="service-results">
        <h2 className="service-results__title">{data.results.title}</h2>
        <div className="service-results__grid">
          {data.results.items.map((r, i) => (
            <div className="service-results__item" key={i}>
              <span className="service-results__stat">{r.stat}</span>
              <span className="service-results__label">{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="service-workflow">
        <div className="service-workflow__header">
          <h2 className="service-workflow__title">{data.workflow.title}</h2>
          <p className="service-workflow__subtitle">{data.workflow.subtitle}</p>
        </div>
        <div className="service-workflow__grid">
          {data.workflow.steps.map((step, i) => (
            <div className="workflow-card" key={i}>
              <div className="workflow-card__header">
                <h3 className="workflow-card__name">{step.name}</h3>
                <span className="workflow-card__duration">{step.duration}</span>
              </div>
              <p className="workflow-card__desc">{step.desc}</p>
              <span className="workflow-card__label">Work involved</span>
              <div className="workflow-card__tags">
                {step.tags.map(t => <span className="workflow-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="service-workflow__timeline">
          {data.workflow.timeline.map((t, i) => (
            <React.Fragment key={i}>
              <span className="timeline-marker">{t}</span>
              {i < data.workflow.timeline.length - 1 && <div className="timeline-line"></div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="service-cta">
        <h2 className="service-cta__title">{data.ctaTitle}</h2>
        <p className="service-cta__desc">{data.ctaDesc}</p>
        <Link to="/contact" className="service-cta__btn">
          <span>Start Your Project</span>
          <ArrowIcon strokeWidth={2.5} />
        </Link>
      </section>

      {/* OTHER SERVICES */}
      <section className="other-services">
        <h3 className="other-services__title">Explore Other Services</h3>
        <div className="other-services__grid">
          {data.otherServices.map(s => (
            <Link to={`/service/${s}`} className="other-services__card" key={s}>
              <span>{services[s].title}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
