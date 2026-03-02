import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './Navbar.css';

export default function Navbar() {
    const { t, language, toggleLanguage } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    const isLandingPage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await signOut(auth);
        setMenuOpen(false);
    };

    // On non-landing pages, always show solid background
    const navClass = `navbar ${scrolled || !isLandingPage ? 'navbar--solid' : ''}`;

    return (
        <nav className={navClass}>
            <div className="navbar__inner">
                <Link to="/" className="navbar__logo">
                    <img src="/images/logo.png" alt="BuildSoft" className="navbar__logo-img" />
                    <span className="navbar__logo-text">BuildSoft</span>
                </Link>

                {/* Desktop links — visible on large screens */}
                <div className="navbar__desktop-links">
                    <Link to="/" className="navbar__link">{t('nav.home')}</Link>
                    <Link to="/contract" className="navbar__link">{t('nav.contract')}</Link>
                    <Link to="/partnership" className="navbar__link">{t('nav.partnership')}</Link>
                    <Link to="/about" className="navbar__link">{t('nav.about')}</Link>
                    <Link to="/create-project" className="navbar__link navbar__link--accent">
                        {t('nav.createProject')}
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="navbar__link">{t('dashboard.title')}</Link>
                            <button onClick={handleLogout} className="navbar__link navbar__link--btn">
                                {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__link">{t('nav.login')}</Link>
                            <Link to="/signup" className="navbar__link navbar__link--signup-btn">
                                {t('nav.signup')}
                            </Link>
                        </>
                    )}
                </div>

                <div className="navbar__right">
                    <button className="navbar__lang" onClick={toggleLanguage} title="Switch language">
                        <span className={`navbar__lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
                        <span className="navbar__lang-divider">/</span>
                        <span className={`navbar__lang-option ${language === 'uz' ? 'active' : ''}`}>UZ</span>
                    </button>

                    {/* Burger — only visible on mobile */}
                    <button
                        className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile slide-in menu */}
            <div className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
                <div className="navbar__menu-overlay" onClick={() => setMenuOpen(false)} />
                <div className="navbar__menu-panel">
                    <div className="navbar__menu-header">
                        <span className="navbar__menu-title">Menu</span>
                        <button className="navbar__menu-close" onClick={() => setMenuOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="navbar__menu-links">
                        <Link to="/" className="navbar__menu-link">{t('nav.home')}</Link>
                        <Link to="/contract" className="navbar__menu-link">{t('nav.contract')}</Link>
                        <Link to="/partnership" className="navbar__menu-link">{t('nav.partnership')}</Link>
                        <Link to="/about" className="navbar__menu-link">{t('nav.about')}</Link>
                        <Link to="/create-project" className="navbar__menu-link navbar__menu-link--accent">
                            {t('nav.createProject')}
                        </Link>
                        <div className="navbar__menu-divider" />
                        {user ? (
                            <>
                                <Link to="/dashboard" className="navbar__menu-link">{t('dashboard.title')}</Link>
                                <button onClick={handleLogout} className="navbar__menu-link navbar__menu-link--btn">
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="navbar__menu-link">{t('nav.login')}</Link>
                                <Link to="/signup" className="navbar__menu-link navbar__menu-link--signup">
                                    {t('nav.signup')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
