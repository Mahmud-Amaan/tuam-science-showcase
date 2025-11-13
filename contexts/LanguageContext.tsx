'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLang) {
      setLangState(savedLang);
    } else {
      // Default to browser language if available, otherwise 'en'
      const browserLang = navigator.language.split('-')[0];
      setLangState(browserLang === 'bn' ? 'bn' : 'en');
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'bn' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
