"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function CategoryNotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{t("menu.categoryNotFound")}</h1>
                <Link href="/menu" className="text-primary underline">
                    {t("common.backToMenu")}
                </Link>
            </div>
        </div>
    );
}
