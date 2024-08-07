import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { TranslationProvider } from "@/hook/useTranslation";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();



    return (
        <TranslationProvider>
            <Component {...pageProps} />
        </TranslationProvider>
    );
}
