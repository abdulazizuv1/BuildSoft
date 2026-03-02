import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './CreateProject.css';

export default function CreateProject() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        area: 120,
        floors: 1,
        style: 'modern',
        materials: 'brick',
        foundation: 'strip',
        familySize: 4,
        energyClass: 'standard',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate cost estimates
            const area = parseInt(form.area) || 120;
            const floors = parseInt(form.floors) || 1;
            const baseCost = area * floors * 450;
            const minCost = Math.round(baseCost * 0.85);
            const maxCost = Math.round(baseCost * 1.15);
            const timeline = Math.round(6 + area / 50 + floors * 2);

            const projectData = {
                ...form,
                area: parseInt(form.area),
                floors: parseInt(form.floors),
                familySize: parseInt(form.familySize),
                estimatedCostMin: minCost,
                estimatedCostMax: maxCost,
                timeline,
                ownerUid: auth.currentUser?.uid || null,
                ownerEmail: auth.currentUser?.email || null,
                status: 'draft',
                phases: {
                    foundation: 0,
                    walls: 0,
                    roof: 0,
                    engineering: 0,
                    interior: 0,
                },
                budgetSpent: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Save to Firestore — each project gets a unique auto-generated ID
            const docRef = await addDoc(collection(db, 'projects'), projectData);

            // Navigate to dashboard with the project ID
            navigate('/dashboard', {
                state: {
                    project: { ...projectData, id: docRef.id },
                    projectId: docRef.id,
                },
            });
        } catch (err) {
            console.error('Error saving project:', err);
            // Still navigate with local data if Firestore fails
            navigate('/dashboard', { state: { project: form } });
        }

        setLoading(false);
    };

    const steps = [
        { num: '01', text: t('createProject.step1'), icon: '✏️' },
        { num: '02', text: t('createProject.step2'), icon: '🏠' },
        { num: '03', text: t('createProject.step3'), icon: '📊' },
        { num: '04', text: t('createProject.step4'), icon: '🤝' },
    ];

    return (
        <div className="create-project-page">
            <section className="create-hero">
                <div className="container">
                    <h1 className="create-hero__title">{t('createProject.title')}</h1>
                    <p className="create-hero__subtitle">{t('createProject.subtitle')}</p>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works section">
                <div className="container">
                    <h2 className="section-title">{t('createProject.howItWorks')}</h2>
                    <div className="how-it-works__grid">
                        {steps.map((step) => (
                            <div key={step.num} className="how-step">
                                <span className="how-step__icon">{step.icon}</span>
                                <span className="how-step__num">{step.num}</span>
                                <p className="how-step__text">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Form */}
            <section className="create-form section">
                <div className="container">
                    <div className="create-form__card">
                        <h2 className="create-form__title">{t('createProject.formTitle')}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="create-form__grid">
                                <div className="form-group">
                                    <label className="form-label">{t('createProject.area')}</label>
                                    <input
                                        type="number"
                                        name="area"
                                        value={form.area}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="50"
                                        max="1000"
                                        required
                                    />
                                    <input
                                        type="range"
                                        name="area"
                                        value={form.area}
                                        onChange={handleChange}
                                        min="50"
                                        max="500"
                                        className="create-form__range"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.floors')}</label>
                                    <div className="create-form__floor-btns">
                                        {[1, 2, 3].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                className={`create-form__floor-btn ${form.floors === n ? 'active' : ''}`}
                                                onClick={() => setForm({ ...form, floors: n })}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.style')}</label>
                                    <select name="style" value={form.style} onChange={handleChange} className="form-select">
                                        {Object.entries(t('createProject.styles') || {}).map(([key, val]) => (
                                            <option key={key} value={key}>{typeof val === 'string' ? val : key}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.materials')}</label>
                                    <select name="materials" value={form.materials} onChange={handleChange} className="form-select">
                                        {Object.entries(t('createProject.materialOptions') || {}).map(([key, val]) => (
                                            <option key={key} value={key}>{typeof val === 'string' ? val : key}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.foundation')}</label>
                                    <select name="foundation" value={form.foundation} onChange={handleChange} className="form-select">
                                        {Object.entries(t('createProject.foundationOptions') || {}).map(([key, val]) => (
                                            <option key={key} value={key}>{typeof val === 'string' ? val : key}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.familySize')}</label>
                                    <input
                                        type="number"
                                        name="familySize"
                                        value={form.familySize}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="1"
                                        max="20"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('createProject.energyClass')}</label>
                                    <select name="energyClass" value={form.energyClass} onChange={handleChange} className="form-select">
                                        {Object.entries(t('createProject.energyOptions') || {}).map(([key, val]) => (
                                            <option key={key} value={key}>{typeof val === 'string' ? val : key}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '8px' }}>
                                <label className="form-label">{t('createProject.additionalNotes')}</label>
                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    rows={4}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
                                {loading ? t('createProject.submitting') : t('createProject.submit')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
