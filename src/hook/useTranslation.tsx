import {createContext, FC, ReactNode, useCallback, useContext, useEffect, useState} from 'react';

type Translations = {
    [key: string]: unknown;
};

const translationFiles = ['about', 'common'];

const loadTranslations = async (locale: string, filename: string): Promise<Translations> => {

    const response = await fetch(`/locales/${locale}/${filename}.json`);
    if (!response.ok) {
        throw new Error(`Could not load translations for locale: ${locale} and file: ${filename}`);
    }
    return await response.json();
};

const loadAllTranslations = async (locale: string): Promise<Translations> => {
    const translations: Translations = {};

    for (const filename of translationFiles) {
        try {
            translations[filename] = await loadTranslations(locale, filename);

        } catch (error) {
            console.error(`Could not load translations for file: ${filename}`, error);
        }
    }


    return translations;
};

const TranslationContext = createContext<{
    t: (key: string) => string,
    locale: string,
    setLocale: (locale: string) => void,
    loading: boolean
}>({
    t: (key: string) => key,
    locale: 'th',
    setLocale: () => {},
    loading: true
});

export const TranslationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [translations, setTranslations] = useState<Translations>({});
    const [locale, setLocaleState] = useState<string>('th');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocaleState(storedLocale);

        }
    }, []);

    const loadTranslations = useCallback(async () => {
        setLoading(true);
        try {
            const allTranslations = await loadAllTranslations(locale);
            setTranslations(allTranslations);
        } catch (error) {
            console.error(`Error loading translations for locale: ${locale}`, error);
            setTranslations({});
        } finally {
            setLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        loadTranslations();
    }, [locale, loadTranslations]);

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
        <TranslationContext.Provider value={{ t, locale, setLocale, loading }}>
            {children}
        </TranslationContext.Provider>
    );
};

const useTranslation = () => useContext(TranslationContext);

export default useTranslation;
