import { useState, useEffect } from 'react';
import Link from 'next/link';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center justify-between z-50 gap-4">
            <p className="text-sm">
                Мы используем файлы cookie для обеспечения работы сайта и анонимной аналитики. 
                Продолжая, вы соглашаетесь с нашей <Link href="/privacy" className="underline hover:text-violet-300">Политикой конфиденциальности</Link>.
            </p>
            <button
                onClick={handleAccept}
                className="px-4 py-2 bg-violet-600 rounded-md hover:bg-violet-700 flex-shrink-0"
            >
                Понятно
            </button>
        </div>
    );
};
