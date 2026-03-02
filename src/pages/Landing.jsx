import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Landing.css';

export default function Landing() {
    const { t } = useLanguage();
    const advantagesRef = useRef(null);
    const partnersRef = useRef(null);
    const videoRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleCanPlay = () => setVideoReady(true);
            video.addEventListener('canplay', handleCanPlay);
            // If already loaded (e.g. from cache)
            if (video.readyState >= 3) setVideoReady(true);
            return () => video.removeEventListener('canplay', handleCanPlay);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = document.querySelectorAll('.advantage-card, .partner-logo');
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    const advantages = [
        {
            key: 'transparency',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" stroke="var(--color-accent)" strokeWidth="2" opacity="0.2" />
                    <path d="M16 24L22 30L32 18" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="24" cy="24" r="14" stroke="var(--color-accent)" strokeWidth="2" />
                </svg>
            ),
        },
        {
            key: 'monitoring',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="22" rx="3" stroke="var(--color-accent)" strokeWidth="2" />
                    <path d="M14 28L20 22L26 26L34 18" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="34" cy="18" r="2" fill="var(--color-accent)" />
                    <path d="M20 34H28" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            key: 'protection',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 6L38 14V24C38 32 32 38 24 42C16 38 10 32 10 24V14L24 6Z" stroke="var(--color-accent)" strokeWidth="2" />
                    <path d="M18 24L22 28L30 20" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            key: 'constructor',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8L40 18V34L24 44L8 34V18L24 8Z" stroke="var(--color-accent)" strokeWidth="2" />
                    <path d="M24 8V24M24 24L40 18M24 24L8 18M24 24V44M24 24L40 34M24 24L8 34" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
                </svg>
            ),
        },
        {
            key: 'optimization',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="16" stroke="var(--color-accent)" strokeWidth="2" />
                    <path d="M24 14V24L30 28" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M36 12L40 8M12 36L8 40" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="24" cy="24" r="3" fill="var(--color-accent)" />
                </svg>
            ),
        },
        {
            key: 'postConstruction',
            icon: (
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 38V22L24 10L38 22V38H28V28H20V38H10Z" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M20 28H28V38" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
                    <circle cx="33" cy="15" r="6" fill="var(--color-accent)" opacity="0.2" stroke="var(--color-accent)" strokeWidth="1.5" />
                    <path d="M31 15H35M33 13V17" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    const partnerNames = [
        'Uzbekistan Construction Co.',
        'TashStroy Group',
        'Orient Building',
        'ECO Materials',
        'Smart Home UZ',
        'Premier Concrete',
    ];

    return (
        <div className="landing">
            {/* Loading Screen */}
            {!videoReady && (
                <div className="landing-loader">
                    <div className="landing-loader__content">
                        <img src="/images/logo.png" alt="BuildSoft" className="landing-loader__logo" />
                        <h2 className="landing-loader__title">BuildSoft</h2>
                        <div className="landing-loader__spinner">
                            <div className="landing-loader__bar" />
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className={`hero ${videoReady ? 'hero--loaded' : ''}`}>
                <div className="hero__video-wrap">
                    <video
                        ref={videoRef}
                        className="hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/images/hero-poster.jpg"
                    >
                        <source src="/videos/header_bg.mp4" type="video/mp4" />
                    </video>
                    <div className="hero__overlay" />
                </div>

                <div className="hero__content">
                    <div className="hero__badge">🏗️ Construction Platform</div>
                    <h1 className="hero__title">{t('hero.title')}</h1>
                    <p className="hero__subtitle">{t('hero.subtitle')}</p>
                    <div className="hero__actions">
                        <Link to="/create-project" className="btn btn-primary btn-large hero__cta">
                            {t('hero.cta')}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link to="/about" className="btn btn-secondary btn-large">
                            {t('nav.about')}
                        </Link>
                    </div>

                    <div className="hero__stats">
                        <div className="hero__stat">
                            <span className="hero__stat-number">150+</span>
                            <span className="hero__stat-label">{t('about.stat1')}</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <span className="hero__stat-number">50+</span>
                            <span className="hero__stat-label">{t('about.stat2')}</span>
                        </div>
                        <div className="hero__stat-divider" />
                        <div className="hero__stat">
                            <span className="hero__stat-number">30%</span>
                            <span className="hero__stat-label">{t('about.stat3')}</span>
                        </div>
                    </div>
                </div>

                <div className="hero__scroll-indicator">
                    <div className="hero__scroll-mouse">
                        <div className="hero__scroll-dot" />
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="advantages section" ref={advantagesRef}>
                <div className="container">
                    <h2 className="section-title">{t('advantages.sectionTitle')}</h2>
                    <p className="section-subtitle">{t('hero.subtitle')}</p>
                    <div className="advantages__grid">
                        {advantages.map((adv, i) => (
                            <div key={adv.key} className="advantage-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="advantage-card__icon">
                                    {adv.icon}
                                </div>
                                <h3 className="advantage-card__title">{t(`advantages.${adv.key}.title`)}</h3>
                                <p className="advantage-card__desc">{t(`advantages.${adv.key}.desc`)}</p>
                                <div className="advantage-card__number">{String(i + 1).padStart(2, '0')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="partners section" ref={partnersRef}>
                <div className="container">
                    <h2 className="section-title">{t('partners.sectionTitle')}</h2>
                    <p className="section-subtitle">{t('partners.subtitle')}</p>
                    <div className="partners__track">
                        <div className="partners__slider">
                            {[...partnerNames, ...partnerNames].map((name, i) => (
                                <div key={i} className="partner-logo">
                                    <div className="partner-logo__placeholder">
                                        <span>{name.split(' ').map(w => w[0]).join('')}</span>
                                    </div>
                                    <p className="partner-logo__name">{name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
