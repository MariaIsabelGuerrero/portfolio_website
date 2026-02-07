'use client';

import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2026{" "}
          <a href="https://www.maria.portfolio" className="hover:underline">
            Maria™
          </a>
          . {t("All Rights Reserved.", "Tous droits réservés.")}
        </span>
      </center>
    </footer>
  );
}
