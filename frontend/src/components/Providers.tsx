"use client";

import { LanguageProvider } from "@/lib/i18n";
import { SiteContentProvider } from "@/lib/site-content";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SiteContentProvider>{children}</SiteContentProvider>
    </LanguageProvider>
  );
}
