import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { it } from "./locales/it";
import { en } from "./locales/en";

export const LANGUAGE_STORAGE_KEY = "app_lang";
export const SUPPORTED_LANGUAGES = ["it", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  it,
  en,
};

function isSupported(lang: string | null | undefined): lang is Language {
  return !!lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang);
}

/**
 * Initial language: the one saved in the browser (same key as the other MySagra apps);
 * otherwise the phone language — Italian for Italian phones, English for everyone else.
 */
function initialLanguage(): Language {
  if (typeof window === "undefined") return "it";
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupported(saved)) return saved;
  } catch {
    // Storage unavailable: fall back to the browser language
  }
  const browser = (navigator.languages?.[0] ?? navigator.language ?? "it").toLowerCase();
  return browser.startsWith("it") ? "it" : "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage(), // "it" on the server, the saved/browser language on the client
    fallbackLng: "it",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

/** Intl locale for numbers and dates in the current language. */
export function intlLocale(lang: string = i18n.language): string {
  return lang === "en" ? "en-GB" : "it-IT";
}

export default i18n;
