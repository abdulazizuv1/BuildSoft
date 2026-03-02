import { createContext, useContext, useState, useCallback } from 'react';
import en from './en.json';
import uz from './uz.json';

const translations = { en, uz };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = useCallback(() => {
        setLanguage(prev => prev === 'en' ? 'uz' : 'en');
    }, []);

    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
