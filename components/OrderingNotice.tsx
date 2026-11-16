"use client";

import { Clock, Eye } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

/**
 * Minimal one-line notice about ordering availability.
 *  - SCHEDULE outside opening hours: "Invio ordini dalle HH:mm alle HH:mm"
 *  - CLOSED: view-only menu notice
 * Renders nothing when orders can be sent.
 *
 * variant "strip": full-width thin bar (under the header)
 * variant "pill": compact rounded badge (login page)
 */
export function OrderingNotice({
  variant = "strip",
  className,
}: {
  variant?: "strip" | "pill";
  className?: string;
}) {
  const { orderingStatus } = useSettings();

  if (orderingStatus.canSend) return null;

  const isClosed = orderingStatus.reason === "CLOSED";
  const Icon = isClosed ? Eye : Clock;
  const text = isClosed
    ? "Ordini dall'app non disponibili: consulta il menu e ordina in cassa"
    : `Invio ordini dalle ${orderingStatus.opensAt} alle ${orderingStatus.closesAt}`;

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "mx-auto flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-900 select-none dark:border-red-900 dark:bg-red-950 dark:text-red-50",
          className
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
        {text}
      </div>
    );
  }

  return (
    <div className={cn("border-t border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950", className)}>
      <p className="container max-w-lg mx-auto flex items-center justify-center gap-1.5 px-4 py-1 text-center text-xs font-medium text-red-900 select-none dark:text-red-50">
        <Icon className="h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400" />
        {text}
      </p>
    </div>
  );
}
