import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import HouseViewer from '../three/HouseViewer';
import './Dashboard.css';

/* ===== AUTH MODAL ===== */
function AuthModal({ onClose, onAuthSuccess }) {
    const { t } = useLanguage();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ fullName: '', email: '', password: '' });
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
            if (mode === 'login') {
                await signInWithEmailAndPassword(auth, form.email, form.password);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
                if (form.fullName) await updateProfile(cred.user, { displayName: form.fullName });
            }
            onAuthSuccess?.();
            onClose();
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal__close" onClick={onClose}>×</button>
                <h2 className="auth-modal__title">
                    {mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}
                </h2>
                <p className="auth-modal__subtitle">
                    {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
                </p>
                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                        <div className="form-group">
                            <label className="form-label">{t('auth.fullName')}</label>
                            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="form-input" />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">{t('auth.email')}</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{t('auth.password')}</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-input" required minLength={6} />
                    </div>
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? '...' : mode === 'login' ? t('auth.loginBtn') : t('auth.signupBtn')}
                    </button>
                </form>
                <p className="auth-modal__switch">
                    {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                    <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                        {mode === 'login' ? t('nav.signup') : t('nav.login')}
                    </button>
                </p>
            </div>
        </div>
    );
}

/* ===== PROJECT SELECTOR MODAL ===== */
function ProjectSelectorModal({ projects, onSelect, onClose }) {
    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal project-selector-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal__close" onClick={onClose}>×</button>
                <h2 className="auth-modal__title">📂 Choose Your Project</h2>
                <p className="auth-modal__subtitle">Select a project to view its progress</p>
                {projects.length === 0 ? (
                    <div className="project-selector-empty">
                        <span>🏗️</span>
                        <p>No projects found. Create a new one!</p>
                        <Link to="/create-project" className="btn btn-primary" style={{ marginTop: 12 }}>
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="project-selector-list">
                        {projects.map((p) => (
                            <button key={p.id} className="project-selector-item" onClick={() => onSelect(p)}>
                                <div className="project-selector-item__icon">🏠</div>
                                <div className="project-selector-item__info">
                                    <span className="project-selector-item__name">
                                        {p.style?.charAt(0).toUpperCase() + p.style?.slice(1)} House — {p.area}m²
                                    </span>
                                    <span className="project-selector-item__meta">
                                        {p.floors} floor{p.floors > 1 ? 's' : ''} • ${p.estimatedCostMin?.toLocaleString()} — ${p.estimatedCostMax?.toLocaleString()}
                                    </span>
                                </div>
                                <span className="project-selector-item__status">{p.status || 'draft'}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ===== SIDEBAR PANELS ===== */
function ProjectOverviewPanel({ project, t }) {
    const area = parseInt(project.area) || 120;
    const floors = parseInt(project.floors) || 1;
    const minCost = project.estimatedCostMin || Math.round(area * floors * 450 * 0.85);
    const maxCost = project.estimatedCostMax || Math.round(area * floors * 450 * 1.15);
    const timeline = project.timeline || Math.round(6 + area / 50 + floors * 2);

    return (
        <div className="dash-panel">
            <h2 className="dash-panel__title">{t('dashboard.viewer3d')}</h2>
            <div className="dash-3d-wrap">
                <HouseViewer project={project} />
            </div>
            <p className="dash-3d-hint">🖱️ Drag to rotate • Scroll to zoom</p>

            <h2 className="dash-panel__title" style={{ marginTop: 32 }}>{t('dashboard.projectOverview')}</h2>
            <div className="overview-grid">
                <div className="overview-item">
                    <span className="overview-item__label">{t('dashboard.estimatedCost')}</span>
                    <span className="overview-item__value">${minCost.toLocaleString()} — ${maxCost.toLocaleString()}</span>
                </div>
                <div className="overview-item">
                    <span className="overview-item__label">{t('dashboard.timeline')}</span>
                    <span className="overview-item__value">{timeline} {t('dashboard.months')}</span>
                </div>
                <div className="overview-item">
                    <span className="overview-item__label">{t('dashboard.area')}</span>
                    <span className="overview-item__value">{area} m²</span>
                </div>
                <div className="overview-item">
                    <span className="overview-item__label">{t('dashboard.floors')}</span>
                    <span className="overview-item__value">{floors}</span>
                </div>
            </div>
            {project.id && (
                <p className="project-uid">Project ID: <code>{project.id}</code></p>
            )}
        </div>
    );
}

function PhasesPanel({ project, t }) {
    const ph = project.phases || {};
    const phases = [
        { key: 'phase1', progress: ph.foundation ?? 100, color: '#10B981' },
        { key: 'phase2', progress: ph.walls ?? 72, color: '#3B82F6' },
        { key: 'phase3', progress: ph.roof ?? 35, color: '#F59E0B' },
        { key: 'phase4', progress: ph.engineering ?? 10, color: '#8B5CF6' },
        { key: 'phase5', progress: ph.interior ?? 0, color: '#EC4899' },
    ];

    return (
        <div className="dash-panel">
            <h2 className="dash-panel__title">{t('dashboard.phases')}</h2>
            <div className="phases-list">
                {phases.map((phase) => (
                    <div key={phase.key} className="phase-row">
                        <div className="phase-row__header">
                            <span className="phase-row__name">{t(`dashboard.${phase.key}`)}</span>
                            <span className="phase-row__pct" style={{ color: phase.color }}>{phase.progress}%</span>
                        </div>
                        <div className="phase-row__bar">
                            <div className="phase-row__fill" style={{ width: `${phase.progress}%`, backgroundColor: phase.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BudgetPanel({ project, t }) {
    const area = parseInt(project.area) || 120;
    const floors = parseInt(project.floors) || 1;
    const maxCost = project.estimatedCostMax || Math.round(area * floors * 450 * 1.15);
    const actualSpent = project.budgetSpent || Math.round(maxCost * 0.43);

    const categories = [
        { label: t('dashboard.phase1'), planned: Math.round(maxCost * 0.2), actual: Math.round(actualSpent * 0.44), color: '#10B981' },
        { label: t('dashboard.phase2'), planned: Math.round(maxCost * 0.25), actual: Math.round(actualSpent * 0.37), color: '#3B82F6' },
        { label: t('dashboard.phase3'), planned: Math.round(maxCost * 0.15), actual: Math.round(actualSpent * 0.12), color: '#F59E0B' },
        { label: t('dashboard.phase4'), planned: Math.round(maxCost * 0.2), actual: Math.round(actualSpent * 0.05), color: '#8B5CF6' },
        { label: t('dashboard.phase5'), planned: Math.round(maxCost * 0.2), actual: Math.round(actualSpent * 0.02), color: '#EC4899' },
    ];

    return (
        <div className="dash-panel">
            <h2 className="dash-panel__title">{t('dashboard.budget')}</h2>
            <div className="budget-summary">
                <div className="budget-summary__item">
                    <span className="budget-summary__label">{t('dashboard.planned')}</span>
                    <span className="budget-summary__value">${maxCost.toLocaleString()}</span>
                </div>
                <div className="budget-summary__item">
                    <span className="budget-summary__label">{t('dashboard.actual')}</span>
                    <span className="budget-summary__value budget-summary__value--accent">${actualSpent.toLocaleString()}</span>
                </div>
            </div>
            <div className="budget-table">
                {categories.map((cat, i) => (
                    <div key={i} className="budget-row">
                        <span className="budget-row__dot" style={{ backgroundColor: cat.color }} />
                        <span className="budget-row__label">{cat.label}</span>
                        <span className="budget-row__planned">${cat.planned.toLocaleString()}</span>
                        <span className="budget-row__actual">${cat.actual.toLocaleString()}</span>
                        <div className="budget-row__bar">
                            <div className="budget-row__fill" style={{ width: `${cat.planned > 0 ? (cat.actual / cat.planned) * 100 : 0}%`, backgroundColor: cat.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CompaniesPanel() {
    const companies = [
        { name: 'TashStroy Group', type: 'General Contractor', rating: 4.8 },
        { name: 'Orient Building', type: 'Architecture Firm', rating: 4.6 },
        { name: 'ECO Materials', type: 'Material Supplier', rating: 4.9 },
        { name: 'Smart Home UZ', type: 'Smart Home Integration', rating: 4.7 },
        { name: 'Premier Concrete', type: 'Concrete Supplier', rating: 4.5 },
    ];

    return (
        <div className="dash-panel">
            <h2 className="dash-panel__title">Companies</h2>
            <div className="companies-list">
                {companies.map((c, i) => (
                    <div key={i} className="company-card">
                        <div className="company-card__avatar">
                            {c.name.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div className="company-card__info">
                            <h4 className="company-card__name">{c.name}</h4>
                            <span className="company-card__type">{c.type}</span>
                        </div>
                        <div className="company-card__rating">⭐ {c.rating}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AIHelperPanel() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I\'m your BuildSoft AI assistant. I can help you with cost estimates, material recommendations, and construction planning. How can I help you today?' },
    ]);
    const [input, setInput] = useState('');

    const aiResponses = [
        'Based on your project specs, I recommend using reinforced concrete for the foundation — it provides the best cost-to-durability ratio for your region.',
        'Your current timeline looks realistic. I\'d suggest adding a 2-week buffer for weather delays during the roof phase.',
        'For energy efficiency, consider adding thermal insulation (mineral wool, 150mm) — it will save approximately 30% on heating costs within the first 5 years.',
        'The current cost estimate is within market range for Tashkent. You could save 10-15% by sourcing materials directly from ECO Materials through our platform.',
        'Smart home integration during construction (rather than retrofit) typically costs 40% less. I recommend planning electrical conduits for automation now.',
    ];

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        const aiResponse = { role: 'assistant', text: aiResponses[Math.floor(Math.random() * aiResponses.length)] };
        setMessages([...messages, userMsg, aiResponse]);
        setInput('');
    };

    return (
        <div className="dash-panel dash-panel--chat">
            <h2 className="dash-panel__title">AI Assistant</h2>
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                        <div className="chat-msg__bubble">
                            {msg.role === 'assistant' && <span className="chat-msg__avatar">🤖</span>}
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything about your project..."
                    className="form-input"
                />
                <button onClick={handleSend} className="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function SupportPanel({ t }) {
    const [form, setForm] = useState({ subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setForm({ subject: '', message: '' });
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="dash-panel">
            <h2 className="dash-panel__title">Support</h2>
            <p className="dash-panel__desc">Need help? Send us a message and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="form-textarea"
                        rows={5}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                {sent && <div className="form-status form-status--success" style={{ marginTop: 12 }}>Message sent! We'll respond soon.</div>}
            </form>
            <div className="support-contacts">
                <h4>Direct Contact</h4>
                <a href="mailto:support@buildsoft.uz" className="support-contact">📧 support@buildsoft.uz</a>
                <a href="tel:+998901234567" className="support-contact">📞 +998 90 123 45 67</a>
                <a href="https://t.me/buildsoft" target="_blank" rel="noreferrer" className="support-contact">💬 Telegram: @buildsoft</a>
            </div>
        </div>
    );
}

/* ===== SIDEBAR CONFIG ===== */
const SIDEBAR_ITEMS = [
    { key: 'overview', icon: '📊', label: 'Project Overview' },
    { key: 'phases', icon: '🏗️', label: 'Construction Phases' },
    { key: 'budget', icon: '💰', label: 'Budget Tracker' },
    { key: 'companies', icon: '🏢', label: 'Companies' },
    { key: 'ai', icon: '🤖', label: 'AI Helper' },
    { key: 'support', icon: '📞', label: 'Support' },
];

/* ===== MAIN DASHBOARD ===== */
export default function Dashboard() {
    const { t, language, toggleLanguage } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState('overview');
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProjectSelector, setShowProjectSelector] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Current project — from navigation state or default
    const [currentProject, setCurrentProject] = useState(
        location.state?.project || {
            area: 120, floors: 1, style: 'modern', materials: 'brick',
            foundation: 'strip', familySize: 4, energyClass: 'standard',
            id: location.state?.projectId || null,
        }
    );

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            if (u) {
                loadUserProjects(u.uid);
            }
        });
        return unsub;
    }, []);

    // Load all projects for this user from Firestore
    const loadUserProjects = async (uid) => {
        setLoadingProjects(true);
        try {
            const q = query(collection(db, 'projects'), where('ownerUid', '==', uid));
            const snapshot = await getDocs(q);
            const projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setUserProjects(projects);
        } catch (err) {
            console.error('Error loading projects:', err);
        }
        setLoadingProjects(false);
    };

    // After auth, claim the current project if it has no owner
    const handleAuthSuccess = async () => {
        const u = auth.currentUser;
        if (u && currentProject.id && !currentProject.ownerUid) {
            try {
                await updateDoc(doc(db, 'projects', currentProject.id), {
                    ownerUid: u.uid,
                    ownerEmail: u.email,
                });
                setCurrentProject({ ...currentProject, ownerUid: u.uid });
            } catch (err) {
                console.error('Error claiming project:', err);
            }
        }
    };

    const handleSelectProject = (project) => {
        setCurrentProject(project);
        setShowProjectSelector(false);
        setActivePanel('overview');
    };

    const renderPanel = () => {
        switch (activePanel) {
            case 'overview': return <ProjectOverviewPanel project={currentProject} t={t} />;
            case 'phases': return <PhasesPanel project={currentProject} t={t} />;
            case 'budget': return <BudgetPanel project={currentProject} t={t} />;
            case 'companies': return <CompaniesPanel />;
            case 'ai': return <AIHelperPanel />;
            case 'support': return <SupportPanel t={t} />;
            default: return <ProjectOverviewPanel project={currentProject} t={t} />;
        }
    };

    return (
        <div className="dashboard">
            {/* Custom Dashboard Navbar */}
            <header className="dash-navbar">
                <div className="dash-navbar__left">
                    <button className="dash-navbar__sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                        </svg>
                    </button>
                    <Link to="/" className="dash-navbar__logo">
                        <img src="/images/logo.png" alt="BuildSoft" />
                        <span>BuildSoft</span>
                    </Link>
                </div>
                <div className="dash-navbar__right">
                    {user && (
                        <button
                            className="btn btn-outline dash-navbar__projects-btn"
                            onClick={() => setShowProjectSelector(true)}
                        >
                            📂 Projects {loadingProjects ? '...' : `(${userProjects.length})`}
                        </button>
                    )}
                    <button className="navbar__lang" onClick={toggleLanguage}>
                        <span className={`navbar__lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
                        <span className="navbar__lang-divider">/</span>
                        <span className={`navbar__lang-option ${language === 'uz' ? 'active' : ''}`}>UZ</span>
                    </button>
                    {user ? (
                        <div className="dash-navbar__user">
                            <span className="dash-navbar__user-name">{user.displayName || user.email}</span>
                        </div>
                    ) : (
                        <button className="btn btn-primary dash-navbar__save" onClick={() => setShowAuthModal(true)}>
                            💾 Save
                        </button>
                    )}
                </div>
            </header>

            <div className="dashboard__body">
                {/* Sidebar */}
                <aside className={`dash-sidebar ${sidebarOpen ? 'dash-sidebar--open' : ''}`}>
                    <div className="dash-sidebar__overlay" onClick={() => setSidebarOpen(false)} />
                    <nav className="dash-sidebar__nav">
                        {SIDEBAR_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                className={`dash-sidebar__item ${activePanel === item.key ? 'dash-sidebar__item--active' : ''}`}
                                onClick={() => { setActivePanel(item.key); setSidebarOpen(false); }}
                            >
                                <span className="dash-sidebar__icon">{item.icon}</span>
                                <span className="dash-sidebar__label">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="dash-sidebar__bottom">
                        <Link to="/create-project" className="dash-sidebar__new-project">
                            + New Project
                        </Link>
                        <Link to="/" className="dash-sidebar__back">
                            ← Back to Home
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dash-main">
                    {renderPanel()}
                </main>
            </div>

            {/* Modals */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />}
            {showProjectSelector && (
                <ProjectSelectorModal
                    projects={userProjects}
                    onSelect={handleSelectProject}
                    onClose={() => setShowProjectSelector(false)}
                />
            )}
        </div>
    );
}
