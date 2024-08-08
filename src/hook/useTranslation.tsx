import { createContext, useContext, useEffect, useState } from 'react';

type Translations = {
    [key: string]: any;
};

const loadTranslations = async (locale: string, filename: string): Promise<Translations> => {
    const response = await fetch(`/locales/${locale}/${filename}.json`);
    if (!response.ok) {
        throw new Error(`Could not load translations for locale: ${locale} and file: ${filename}`);
    }
    return await response.json();
};

const TranslationContext = createContext<{
    t: (key: string) => string,
    locale: string,
    setLocale: (locale: string) => void,
    loadTranslationFiles: (filenames: string[]) => Promise<void>
}>({
    t: (key: string) => key,
    locale: 'th',
    setLocale: () => {},
    loadTranslationFiles: async () => {}
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [translations, setTranslations] = useState<Translations>({});
    const [locale, setLocaleState] = useState<string>('th'); // Default to 'th' initially

    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocaleState(storedLocale);
        }
    }, []);

    const loadTranslationFiles = async (filenames: string[]) => {
        try {
            const loadedTranslationsArray = await Promise.all(
                filenames.map((filename) => loadTranslations(locale, filename))
            );
            const mergedTranslations = Object.assign({}, ...loadedTranslationsArray);
            setTranslations(mergedTranslations);
        } catch (error) {
            console.error(error);
            setTranslations({});
        }
    };

    useEffect(() => {
        loadTranslationFiles(['common']);

    }, [locale]);



    const setLocale = (newLocale: string) => {
        setLocaleState(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let translation: any = translations;
        for (let k of keys) {
            translation = translation[k];
            if (translation === undefined) {
                return key;
            }
        }
        if (typeof translation === 'object') {
            return key;
        }
        return String(translation);
    };

    return (
        <TranslationContext.Provider value={{ t, locale, setLocale, loadTranslationFiles }}>
            {children}
        </TranslationContext.Provider>
    );
};

const useTranslation = () => useContext(TranslationContext);

export default useTranslation;
