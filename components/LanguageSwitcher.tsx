"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/i18n";
import { LanguageFlag } from "@/components/LanguageFlag";

/**
 * Minimal language toggle: a single round button showing the current flag.
 * Tapping it switches IT <-> EN. The choice is saved by I18nProvider.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const language: Language = i18n.language === "en" ? "en" : "it";
  const next: Language = language === "it" ? "en" : "it";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors cursor-pointer select-none",
        className
      )}
      title={t("language.switchTo")}
      aria-label={`${t("language.switchTo")}: ${next === "it" ? t("language.italian") : t("language.english")}`}
    >
      <LanguageFlag lang={language} className="h-4 w-6" />
    </button>
  );
}
