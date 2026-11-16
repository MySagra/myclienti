"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/i18n";

/**
 * Inline SVG flags (emoji flags are not rendered on Windows and some Android browsers).
 * Italian flag for "it", Union Jack for "en".
 */
export function LanguageFlag({ lang, className }: { lang: Language; className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 60 40"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-black/10", className)}
    >
      {lang === "it" ? (
        <>
          <rect width="20" height="40" x="0" fill="#009246" />
          <rect width="20" height="40" x="20" fill="#FFFFFF" />
          <rect width="20" height="40" x="40" fill="#CE2B37" />
        </>
      ) : (
        <>
          <clipPath id={`uk-diag-${uid}`}>
            <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
          </clipPath>
          <rect width="60" height="40" fill="#012169" />
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
          <path
            d="M0,0 L60,40 M60,0 L0,40"
            stroke="#C8102E"
            strokeWidth="5"
            clipPath={`url(#uk-diag-${uid})`}
          />
          <path d="M30,0 v40 M0,20 h60" stroke="#FFFFFF" strokeWidth="13" />
          <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="8" />
        </>
      )}
    </svg>
  );
}
