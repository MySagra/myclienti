"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { SUPPORTED_LANGUAGES, type Language } from "@/lib/i18n/i18n";
import { LanguageFlag } from "@/components/LanguageFlag";

/**
 * IT/EN selector with flags, like the login pages of the other MySagra apps.
 * Two buttons, not a menu. The choice is saved by I18nProvider.
 *
 * variant "group": icon + one flag button per language (login page)
 * variant "compact": a single round button with the current flag that toggles the language (header)
 */
export function LanguageSwitcher({
  variant = "group",
  className,
}: {
  variant?: "group" | "compact";
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const language = (i18n.language === "en" ? "en" : "it") as Language;

  if (variant === "compact") {
    const next = language === "it" ? "en" : "it";
    return (
      <button
        type="button"
        onClick={() => i18n.changeLanguage(next)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary/20 transition-colors select-none",
          className
        )}
        title={t("language.switchTo")}
        aria-label={`${t("language.switchTo")}: ${next === "it" ? t("language.italian") : t("language.english")}`}
      >
        <LanguageFlag lang={language} className="h-4 w-6" />
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t("language.label")}
      className={cn("flex w-fit items-stretch rounded-md shadow-xs", className)}
    >
      <div
        className="flex items-center rounded-l-md border bg-muted px-2.5 text-muted-foreground"
        title={t("language.label")}
      >
        <Languages className="h-4 w-4" aria-hidden />
      </div>
      {SUPPORTED_LANGUAGES.map((code, i) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            className={cn(
              "h-9 px-3 flex items-center border border-l-0 cursor-pointer select-none transition-colors",
              i === SUPPORTED_LANGUAGES.length - 1 && "rounded-r-md",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted text-foreground [&>svg]:opacity-50 [&>svg]:grayscale hover:[&>svg]:opacity-100 hover:[&>svg]:grayscale-0"
            )}
            title={code === "it" ? t("language.italian") : t("language.english")}
            aria-label={code === "it" ? t("language.italian") : t("language.english")}
            aria-pressed={active}
            onClick={() => i18n.changeLanguage(code)}
          >
            <LanguageFlag lang={code} />
          </button>
        );
      })}
    </div>
  );
}
