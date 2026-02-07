'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-800 mb-4 animate-bounce">404</h1>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            {t("Oops! Page Not Found", "Oops! Page introuvable")}
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {t(
              "The page you are looking for may have been moved, deleted, or never existed.",
              "La page que vous recherchez a peut-être été déplacée, supprimée ou n'a jamais existé."
            )}
          </p>
        </div>

        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            {t("Go Back", "Retour")}
          </button>

          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            {t("Home", "Accueil")}
          </button>
        </div>
      </div>
    </div>
  );
}
