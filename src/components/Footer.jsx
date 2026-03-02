import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer__wave">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" fill="var(--color-primary)" />
                </svg>
            </div>

            <div className="footer__content">
                <div className="container">
                    <div className="footer__grid">
                        <div className="footer__brand">
                            <div className="footer__logo">
                                <img src="/images/logo.png" alt="BuildSoft" className="footer__logo-img" />
                                <span className="footer__logo-text">BuildSoft</span>
                            </div>
                            <p className="footer__desc">{t('footer.description')}</p>
                        </div>

                        <div className="footer__links">
                            <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
                            <Link to="/" className="footer__link">{t('nav.home')}</Link>
                            <Link to="/about" className="footer__link">{t('nav.about')}</Link>
                            <Link to="/contract" className="footer__link">{t('nav.contract')}</Link>
                            <Link to="/partnership" className="footer__link">{t('nav.partnership')}</Link>
                            <Link to="/create-project" className="footer__link">{t('nav.createProject')}</Link>
                        </div>

                        <div className="footer__contact">
                            <h4 className="footer__heading">{t('footer.contact')}</h4>
                            <a href="mailto:info@buildsoft.uz" className="footer__link">info@buildsoft.uz</a>
                            <a href="tel:+998901234567" className="footer__link">+998 90 123 45 67</a>
                            <p className="footer__link">Tashkent, Uzbekistan</p>
                        </div>

                        <div className="footer__social">
                            <h4 className="footer__heading">{t('footer.followUs')}</h4>
                            <div className="footer__social-icons">
                                <a href="https://t.me/buildsoft" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Telegram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.943z" />
                                    </svg>
                                </a>
                                <a href="https://instagram.com/buildsoft" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/company/buildsoft" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="footer__bottom">
                        <p>{t('footer.rights')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
