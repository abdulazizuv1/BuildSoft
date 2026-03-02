import { useLanguage } from '../i18n/LanguageContext';
import './About.css';

export default function About() {
    const { t } = useLanguage();

    const values = [
        { key: 'value1', icon: '👁️', color: '#3B82F6' },
        { key: 'value2', icon: '📡', color: '#10B981' },
        { key: 'value3', icon: '🛡️', color: '#F59E0B' },
        { key: 'value4', icon: '🚀', color: '#8B5CF6' },
    ];

    const stats = [
        { key: 'stat1', value: '150+' },
        { key: 'stat2', value: '50+' },
        { key: 'stat3', value: '30%' },
        { key: 'stat4', value: '98%' },
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <h1 className="about-hero__title">{t('about.title')}</h1>
                    <p className="about-hero__subtitle">{t('about.subtitle')}</p>
                </div>
            </section>

            <section className="about-mission section">
                <div className="container">
                    <div className="about-mission__grid">
                        <div className="about-mission__block">
                            <span className="about-mission__badge">🎯</span>
                            <h2 className="about-mission__title">{t('about.missionTitle')}</h2>
                            <p className="about-mission__text">{t('about.missionDesc')}</p>
                        </div>
                        <div className="about-mission__block">
                            <span className="about-mission__badge">📖</span>
                            <h2 className="about-mission__title">{t('about.storyTitle')}</h2>
                            <p className="about-mission__text">{t('about.storyDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-values section">
                <div className="container">
                    <h2 className="section-title">{t('about.values')}</h2>
                    <div className="about-values__grid">
                        {values.map((v) => (
                            <div key={v.key} className="value-card">
                                <div className="value-card__icon-wrap" style={{ '--accent': v.color }}>
                                    <span className="value-card__icon">{v.icon}</span>
                                </div>
                                <h3 className="value-card__title">{t(`about.${v.key}Title`)}</h3>
                                <p className="value-card__desc">{t(`about.${v.key}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="about-stats section">
                <div className="container">
                    <h2 className="section-title" style={{ color: 'white' }}>{t('about.statsTitle')}</h2>
                    <div className="about-stats__grid">
                        {stats.map((s) => (
                            <div key={s.key} className="stat-card">
                                <span className="stat-card__value">{s.value}</span>
                                <span className="stat-card__label">{t(`about.${s.key}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
