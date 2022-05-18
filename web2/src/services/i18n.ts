import i18next, { FormatFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import de from 'src/assets/locales/de';

type LanguageInfo = {
   id: string;
   name: string;
};

const resources = {
   de,
};

export const supportedLanguages: LanguageInfo[] = [
   // { id: 'en', name: 'English' },
   { id: 'de', name: 'Deutsch' },
];

i18next
   .use(initReactI18next)
   .use(LanguageDetector)
   .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: supportedLanguages.map((x) => x.id),
      ns: ['main'],
      defaultNS: 'main',
      nonExplicitSupportedLngs: true,
      interpolation: {
         escapeValue: false,
      },
   });

export default i18next;
