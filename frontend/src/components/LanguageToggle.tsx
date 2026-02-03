"use client";

import { useLanguage } from "@/lib/i18n";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: "en" | "fr") => {
    if (newLang !== language) {
      document.body.style.transition = "opacity 0.15s ease-in-out";
      document.body.style.opacity = "0.95";

      setTimeout(() => {
        setLanguage(newLang);
        document.body.style.opacity = "1";
        setTimeout(() => {
          document.body.style.transition = "";
        }, 150);
      }, 50);
    }
  };

  return (
    <div className="flex items-center gap-1 border border-[#5227FF]/30 rounded-lg p-1">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`h-7 px-3 text-xs font-semibold rounded-md transition-all ${
          language === "en"
            ? "bg-[#5227FF] text-white"
            : "text-[#B19EEF] hover:text-white"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("fr")}
        className={`h-7 px-3 text-xs font-semibold rounded-md transition-all ${
          language === "fr"
            ? "bg-[#5227FF] text-white"
            : "text-[#B19EEF] hover:text-white"
        }`}
        aria-label="Passer au fran&ccedil;ais"
      >
        FR
      </button>
    </div>
  );
};
