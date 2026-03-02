import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './Auth.css';

export default function Signup() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await updateProfile(cred.user, { displayName: form.fullName });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-page__left">
                <div className="auth-page__brand">
                    <img src="/images/logo.png" alt="BuildSoft" className="auth-page__logo" />
                    <h2 className="auth-page__brand-title">BuildSoft</h2>
                    <p className="auth-page__brand-desc">{t('hero.subtitle')}</p>
                </div>
            </div>

            <div className="auth-page__right">
                <div className="auth-card">
                    <h1 className="auth-card__title">{t('auth.signupTitle')}</h1>
                    <p className="auth-card__subtitle">{t('auth.signupSubtitle')}</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('auth.fullName')}</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('auth.email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('auth.password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-input"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">{t('auth.confirmPassword')}</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: '100%' }}>
                            {t('auth.signupBtn')}
                        </button>
                    </form>

                    <p className="auth-card__switch">
                        {t('auth.hasAccount')} <Link to="/login">{t('nav.login')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
