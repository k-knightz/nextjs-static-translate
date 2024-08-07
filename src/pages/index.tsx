import MainLayout from '@/components/Layout/MainLayout';
import useTranslation from "@/hook/useTranslation";


const Home = () => {
    const {t} = useTranslation();

    return (
        <MainLayout>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl py-6">{t('welcome')}</h1>

            </div>
        </MainLayout>
    );
};

export default Home;
