import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

export default function Login() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
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
                    <h1 className="auth-card__title">{t('auth.loginTitle')}</h1>
                    <p className="auth-card__subtitle">{t('auth.loginSubtitle')}</p>

                    <form onSubmit={handleSubmit}>
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
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: '100%' }}>
                            {t('auth.loginBtn')}
                        </button>
                    </form>

                    <p className="auth-card__switch">
                        {t('auth.noAccount')} <Link to="/signup">{t('nav.signup')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
