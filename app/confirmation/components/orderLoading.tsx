"use client"

import {
    Item,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { useTranslation } from "react-i18next"

export function OrderLoading() {
    const { t } = useTranslation()
    return (
        <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
            <Item variant="muted">
                <ItemMedia>
                    <Spinner />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle className="line-clamp-1">{t("confirmation.processing")}</ItemTitle>
                </ItemContent>
            </Item>
        </div>
    )
}
