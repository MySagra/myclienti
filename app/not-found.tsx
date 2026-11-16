"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Image
          src="/not_found.svg"
          alt={t("errors.notFoundAlt")}
          width={320}
          height={313}
          className="mx-auto mb-8"
        />
        <h1 className="font-bold mb-3" style={{ color: "#FECC01" }}>
          <span className="text-8xl font-black block">404</span>
          <span className="text-2xl">{t("errors.notFoundTitle")}</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("errors.notFoundDescription")}
        </p>
        <Link href="/" className="text-sm font-medium underline underline-offset-4" style={{ color: "#FECC01" }}>
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}
