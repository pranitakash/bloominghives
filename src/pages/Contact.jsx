import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useGSAP, { gsap } from '../hooks/useGSAP';
import useHeroCanvas from '../hooks/useHeroCanvas';
import ArrowIcon from '../components/ArrowIcon';
import '../styles/contact.css';

const interestOptions = ['Social Media Management', 'Search Engine Optimization', 'Website Development', 'Google and Meta Ads', 'Content Writing', 'Video Editing', 'Graphic Designing', 'Photoshoot'];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Contact() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const canvasRef = useHeroCanvas('#f0ede8', 'multiply', 0.2);
  const fileInputRef = useRef(null);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const handleFileChange = (e) => {
    const incoming = Array.from(e.target.files);
    setFileError('');

    const valid = [];
    const rejected = [];

    incoming.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(file.name);
      } else {
        valid.push(file);
      }
    });

    if (rejected.length) {
      setFileError(`File${rejected.length > 1 ? 's' : ''} too large (max 10 MB): ${rejected.join(', ')}`);
    }

    if (valid.length) {
      setAttachedFiles(prev => [...prev, ...valid]);
    }

    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    setFileError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = document.getElementById('floating-cta');
        if (el) el.classList.toggle('visible', window.scrollY > window.innerHeight * 0.4);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const containerRef = useGSAP(() => {
    gsap.to('.contact-page .title-line span', { y: 0, opacity: 1, stagger: 0.1, delay: 0.3, duration: 1.2, ease: 'power4.out' });

    const footerGlobe = document.querySelector('.footer__globe');
    if (footerGlobe) {
      gsap.from(footerGlobe, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.footer__globe', start: 'top 85%' } });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <div className="contact-page" ref={containerRef}>
      {/* HERO */}
      <section className="contact-hero" data-theme="light">
        <div className="contact-hero__bg"><canvas ref={canvasRef}></canvas></div>
        <div className="contact-hero__content">
          <h1 className="contact-hero__title">
            <div className="title-line"><span>Good</span> <span>things</span></div>
            <div className="title-line"><span>happen</span> <span>when</span></div>
            <div className="title-line"><span>you</span> <span>say</span> <span>hey</span></div>
          </h1>

          <div className="contact-hero__interests-row">
            <div className="contact-hero__interests">
              <h2 className="interests-title">I am interested in :</h2>
              <div className="interests-grid" id="interest-pills">
                {interestOptions.map(opt => (
                  <button key={opt} className={`interest-chip${selectedInterests.includes(opt) ? ' active' : ''}`} data-interest={opt} onClick={() => toggleInterest(opt)}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="contact-hero__scroll">
              <svg viewBox="0 0 100 100" className="hero-arrow">
                <path d="M20 20 L80 80 M80 30 L80 80 L30 80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Form */}
          <form className="main-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="form-row row-3col">
              <div className="input-group">
                <input type="text" id="fname" name="fname" required placeholder=" " />
                <label htmlFor="fname">First name*</label>
                <div className="input-line"></div>
              </div>
              <div className="input-group">
                <input type="text" id="lname" name="lname" required placeholder=" " />
                <label htmlFor="lname">Last name*</label>
                <div className="input-line"></div>
              </div>
              <div className="input-group">
                <input type="email" id="email" name="email" required placeholder=" " />
                <label htmlFor="email">Email address*</label>
                <div className="input-line"></div>
              </div>
            </div>
            <div className="form-row row-2col">
              <div className="input-group">
                <input type="text" id="budget" name="budget" placeholder=" " />
                <label htmlFor="budget">Budget (₹)</label>
                <div className="input-line"></div>
              </div>
              <div className="input-group file-upload">
                <div className="file-trigger" onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49"></path></svg>
                  <span>Attachments{attachedFiles.length > 0 && ` (${attachedFiles.length})`}</span>
                </div>
                <input type="file" id="attachments" name="attachments" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <div className="input-line"></div>
                {fileError && (
                  <p className="file-error">{fileError}</p>
                )}
                {attachedFiles.length > 0 && (
                  <div className="file-list">
                    {attachedFiles.map((file, i) => (
                      <div key={`${file.name}-${i}`} className="file-chip">
                        <svg className="file-chip__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span className="file-chip__name">{file.name}</span>
                        <span className="file-chip__size">{formatFileSize(file.size)}</span>
                        <button type="button" className="file-chip__remove" onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="form-row row-1col">
              <div className="input-group">
                <textarea id="message" name="message" placeholder=" " rows="1"></textarea>
                <label htmlFor="message">Message</label>
                <div className="input-line"></div>
              </div>
            </div>
            <div className="form-submit-container">
              <button type="submit" className="submit-pill">
                <span>Submit</span>
                <ArrowIcon size={20} strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="contact-info-split" data-theme="dark">
        <div className="info-split__inner">
          <div className="info-split__card">
            <div className="info-split__offices">
              <div className="info-split__office">
                <h3 className="info-split__city">New Delhi</h3>
                <p>Blooming Hives</p>
                <p>Digital Marketing Agency</p>
                <p>New Delhi, Delhi — 110001</p>
                <p>India</p>
              </div>
              <div className="info-split__office">
                <h3 className="info-split__city">Pan India</h3>
                <p>Blooming Hives</p>
                <p>Remote-friendly team.</p>
                <p>Serving clients across India.</p>
              </div>
            </div>
            <a href="tel:+919217542713" className="info-split__phone">+91 92175 42713</a>
            <div className="info-split__faq">
              <p>Have a quick question?</p>
              <p>Check out our FAQs: <Link to="/#faq" className="info-split__faq-link">Working with Blooming Hives</Link></p>
            </div>
          </div>

          <div className="info-split__contact">
            <div className="info-split__email-block">
              <span className="info-split__email-label">General Enquiries</span>
              <a href="mailto:Info@bloominghives.in" className="info-split__email-link">Info@bloominghives.in</a>
            </div>
            <div className="info-split__email-block">
              <span className="info-split__email-label">New Business</span>
              <a href="mailto:business@bloominghives.in" className="info-split__email-link">business@bloominghives.in</a>
            </div>
            <div className="info-split__email-block">
              <span className="info-split__email-label">Careers</span>
              <a href="mailto:careers@bloominghives.in" className="info-split__email-link">careers@bloominghives.in</a>
            </div>
            <div className="info-split__social-block">
              <h3 className="info-split__social-title">Follow us</h3>
              <a href="https://www.linkedin.com/company/bloominghives/" target="_blank" rel="noopener noreferrer" className="info-split__social-item">LinkedIn</a>
              <a href="https://www.facebook.com/profile.php?id=61586175253187" target="_blank" rel="noopener noreferrer" className="info-split__social-item">Facebook</a>
              <a href="https://www.instagram.com/bloominghives.in" target="_blank" rel="noopener noreferrer" className="info-split__social-item">Instagram</a>
              <a href="https://wa.me/919217542713" target="_blank" rel="noopener noreferrer" className="info-split__social-item">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
