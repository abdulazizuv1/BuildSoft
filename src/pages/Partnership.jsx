import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Partnership.css';

export default function Partnership() {
    const { t } = useLanguage();
    const [form, setForm] = useState({ companyName: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'partnership_inquiries'), {
                ...form,
                createdAt: serverTimestamp(),
            });
            setStatus('success');
            setForm({ companyName: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
        setLoading(false);
    };

    const benefits = [
        { key: 'benefit1', icon: '📦' },
        { key: 'benefit2', icon: '📐' },
        { key: 'benefit3', icon: '⚡' },
        { key: 'benefit4', icon: '⭐' },
    ];

    return (
        <div className="partnership-page">
            <section className="partnership-hero">
                <div className="container">
                    <h1 className="partnership-hero__title">{t('partnership.title')}</h1>
                    <p className="partnership-hero__subtitle">{t('partnership.subtitle')}</p>
                </div>
            </section>

            <section className="partnership-benefits section">
                <div className="container">
                    <h2 className="section-title">{t('partnership.whyPartner')}</h2>
                    <div className="partnership-benefits__grid">
                        {benefits.map((b) => (
                            <div key={b.key} className="benefit-card">
                                <span className="benefit-card__icon">{b.icon}</span>
                                <h3 className="benefit-card__title">{t(`partnership.${b.key}Title`)}</h3>
                                <p className="benefit-card__desc">{t(`partnership.${b.key}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="partnership-form section">
                <div className="container">
                    <div className="partnership-form__card">
                        <h2 className="partnership-form__title">{t('partnership.formTitle')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">{t('partnership.companyName')}</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">{t('partnership.email')}</label>
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
                                    <label className="form-label">{t('partnership.phone')}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('partnership.message')}</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: '100%' }}>
                                {loading ? t('partnership.sending') : t('partnership.send')}
                            </button>
                            {status === 'success' && (
                                <div className="form-status form-status--success">{t('partnership.success')}</div>
                            )}
                            {status === 'error' && (
                                <div className="form-status form-status--error">{t('partnership.error')}</div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
