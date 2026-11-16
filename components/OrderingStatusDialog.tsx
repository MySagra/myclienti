"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import type { OrderingStatus } from "@/lib/ordering";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DISMISS_STORAGE_KEY = "mysagra-ordering-alert-dismissed";

function statusKey(status: OrderingStatus): string {
  if (status.reason === "OUTSIDE_SCHEDULE") return `SCHEDULE-${status.opensAt}-${status.closesAt}`;
  return status.reason;
}

/** Short, human readable explanation of why orders cannot be sent. */
export function orderingClosedMessage(status: OrderingStatus): string | null {
  if (status.reason === "CLOSED") {
    return "Al momento non è possibile inviare ordini dall'app. Rivolgiti direttamente alla cassa.";
  }
  if (status.reason === "OUTSIDE_SCHEDULE") {
    return `Puoi già comporre il tuo ordine, ma potrai inviarlo solo dalle ${status.opensAt} alle ${status.closesAt}.`;
  }
  return null;
}

/**
 * Overlay shown as soon as the app opens when ordering is in SCHEDULE mode
 * and outside opening hours. Shown once per session/schedule.
 */
export function OrderingStatusDialog() {
  const { orderingStatus } = useSettings();
  const pathname = usePathname();
  const [dismissedKey, setDismissedKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const key = statusKey(orderingStatus);
  const open = !orderingStatus.canSend && pathname !== "/confirmation" && dismissedKey !== key;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, key);
    } catch { }
    setDismissedKey(key);
  };

  // CLOSED is handled by the view-only menu (notice in the header), no overlay
  if (orderingStatus.canSend || orderingStatus.reason === "CLOSED") return null;

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) handleDismiss(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <Clock className="w-12 h-12 mx-auto text-primary" />
          <AlertDialogTitle className="text-xl text-center">
            Ordini non ancora aperti
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center w-full">
            {orderingClosedMessage(orderingStatus)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDismiss} className="w-full">
            Ho capito
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
