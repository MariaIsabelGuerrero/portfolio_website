"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

export type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, fr: string) => string;
  l: (en: string, fr: string) => string;
  la: (en: string[], fr: string[]) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);

    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;

    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.toLowerCase();
      const detectedLanguage: Language = browserLang.startsWith("fr")
        ? "fr"
        : "en";
      setLanguage(detectedLanguage);
    }
  }, [setLanguage]);

  const t = useCallback(
    (en: string, fr: string) => {
      return language === "en" ? en : fr;
    },
    [language]
  );

  const l = useCallback(
    (en: string, fr: string) => {
      return language === "fr" && fr ? fr : en;
    },
    [language]
  );

  const la = useCallback(
    (en: string[], fr: string[]) => {
      return language === "fr" && fr && fr.length > 0 ? fr : en;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, l, la }),
    [language, setLanguage, t, l, la]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
