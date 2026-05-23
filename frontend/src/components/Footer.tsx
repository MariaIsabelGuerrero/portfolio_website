'use client';

import { useLanguage } from "@/lib/i18n";
import { useProfile } from "@/lib/site-content";

export default function Footer() {
  const { t } = useLanguage();
  const profile = useProfile();
  const year = new Date().getFullYear();
  const displayName = profile.shortName || profile.fullName || "";
  const href = profile.siteUrl || "#";

  return (
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © {year}{" "}
          {displayName && (
            <a href={href} className="hover:underline">
              {displayName}
              {displayName ? "™" : ""}
            </a>
          )}
          . {t("All Rights Reserved.", "Tous droits réservés.")}
        </span>
      </center>
    </footer>
  );
}
