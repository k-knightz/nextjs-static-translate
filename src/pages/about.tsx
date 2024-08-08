import MainLayout from '@/components/Layout/MainLayout';
import useTranslation from "@/hook/useTranslation";
import {useEffect} from "react";


const About = () => {
    const { t,loadTranslationFiles } = useTranslation();
    useEffect(() => {
        loadTranslationFiles(['about', 'common']);
    }, [loadTranslationFiles]);
    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl py-6">{t('about')}</h1>

                <h1 className="text-2xl py-6">{t('welcome')}</h1>
            </div>
        </MainLayout>
    );
};

export default About;
