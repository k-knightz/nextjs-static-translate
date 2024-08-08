import React from 'react';
import {useRouter} from 'next/router';
import useTranslation from '@/hook/useTranslation';

const Header = () => {
    const { t, locale, setLocale } = useTranslation();
    const router = useRouter();

    const changeLanguage = (newLocale: string) => {
        setLocale(newLocale);
    };

    const menus = [
        {
            id: 1,
            path: '/',
            title: t('common.menu.home'),
        },
        {
            id: 2,
            path: '/about',
            title: t('common.menu.about'),
        }
    ];

    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {menus.map((menu) => (
                        <p key={menu.id} className={`hover:text-green-500 cursor-pointer ${router.pathname === menu.path ? 'text-green-500': 'text-white'}`}
                           onClick={() => router.push(menu.path)}>{menu.title}</p>
                    ))}
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`px-4 py-2 ${locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => changeLanguage('th')}
                        className={`px-4 py-2 ${locale === 'th' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                    >
                        TH
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
