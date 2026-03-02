import { useLanguage } from '../i18n/LanguageContext';
import './Contract.css';

export default function Contract() {
    const { t } = useLanguage();

    const steps = [
        { key: 'step1', icon: '📋' },
        { key: 'step2', icon: '💰' },
        { key: 'step3', icon: '✅' },
        { key: 'step4', icon: '⚖️' },
    ];

    const protections = [
        { key: 'escrow', icon: '🔒' },
        { key: 'penalty', icon: '⚡' },
        { key: 'warranty', icon: '🛡️' },
        { key: 'compensation', icon: '💎' },
    ];

    return (
        <div className="contract-page">
            <section className="contract-hero">
                <div className="container">
                    <h1 className="contract-hero__title">{t('contract.title')}</h1>
                    <p className="contract-hero__subtitle">{t('contract.subtitle')}</p>
                </div>
            </section>

            <section className="contract-steps section">
                <div className="container">
                    <h2 className="section-title">{t('contract.howItWorks')}</h2>
                    <div className="contract-steps__grid">
                        {steps.map((step, i) => (
                            <div key={step.key} className="contract-step">
                                <div className="contract-step__connector">
                                    <div className="contract-step__number">{i + 1}</div>
                                    {i < steps.length - 1 && <div className="contract-step__line" />}
                                </div>
                                <div className="contract-step__content">
                                    <span className="contract-step__icon">{step.icon}</span>
                                    <h3 className="contract-step__title">{t(`contract.${step.key}Title`)}</h3>
                                    <p className="contract-step__desc">{t(`contract.${step.key}Desc`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="contract-protection section">
                <div className="container">
                    <h2 className="section-title">{t('contract.protection')}</h2>
                    <div className="contract-protection__grid">
                        {protections.map((p) => (
                            <div key={p.key} className="protection-card">
                                <span className="protection-card__icon">{p.icon}</span>
                                <h3 className="protection-card__title">{t(`contract.${p.key}Title`)}</h3>
                                <p className="protection-card__desc">{t(`contract.${p.key}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
