"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ErrorePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Image
          src="/server_error.svg"
          alt={t("errors.serverAlt")}
          width={320}
          height={248}
          className="mx-auto mb-8"
        />
        <h1 className="font-bold mb-3" style={{ color: "#FECC01" }}>
          <span className="text-8xl font-black block">500</span>
          <span className="text-2xl">{t("errors.serverTitle")}</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("errors.serverDescription")}
        </p>
        <Link href="/" className="text-sm font-medium underline underline-offset-4" style={{ color: "#FECC01" }}>
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
}
