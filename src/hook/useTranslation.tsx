import {createContext, useContext, useEffect, useState} from 'react';

type Translations = {
    [key: string]: any;
};

const loadTranslations = async (locale: string): Promise<Translations> => {
    const response = await fetch(`/locales/${locale}/common.json`);
    if (!response.ok) {
        throw new Error(`Could not load translations for locale: ${locale}`);
    }
    return await response.json();
};

const TranslationContext = createContext<{
    t: (key: string) => string,
    locale: string,
    setLocale: (locale: string) => void
}>({
    t: (key: string) => key,
    locale: 'th',
    setLocale: () => {}
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [translations, setTranslations] = useState<Translations>({});
    const [locale, setLocaleState] = useState<string>('th'); // Default to 'th' initially

    useEffect(() => {
        // Only run this on the client side
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocaleState(storedLocale);
        }
    }, []);

    useEffect(() => {
        loadTranslations(locale).then(setTranslations).catch(error => {
            console.error(error);
            setTranslations({});
        });
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
        <TranslationContext.Provider value={{ t, locale, setLocale }}>
            {children}
        </TranslationContext.Provider>
    );
};

const useTranslation = () => useContext(TranslationContext);

export default useTranslation;
