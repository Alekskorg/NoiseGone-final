import React from 'react';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            NoiseGone
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/history" className="text-gray-600 hover:text-violet-600">
              История
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
            <div className="flex justify-center gap-6 mb-4">
                <Link href="/privacy" className="hover:text-violet-600">Политика</Link>
                <Link href="/terms" className="hover:text-violet-600">Условия</Link>
                <Link href="/impressum" className="hover:text-violet-600">Impressum</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} NoiseGone. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
