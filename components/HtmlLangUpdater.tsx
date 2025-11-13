'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HtmlLangUpdater() {
  const { lang } = useLanguage();

  useEffect(() => {
    // Update the HTML lang attribute when the language changes
    document.documentElement.lang = lang;
  }, [lang]);

  return null; // This component doesn't render anything
}
