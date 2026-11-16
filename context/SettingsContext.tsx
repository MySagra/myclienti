"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { ClientSettings } from "@/schemas/settings";
import { useTranslation } from "react-i18next";
import { formatPrice as formatPriceWith, getOrderingStatus, OrderingStatus } from "@/lib/ordering";
import { intlLocale } from "@/lib/i18n/i18n";

const SETTINGS_REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CLOCK_TICK_INTERVAL = 15 * 1000; // 15 seconds

interface SettingsContextType {
  settings: ClientSettings;
  timezone: string;
  currency: string;
  orderingStatus: OrderingStatus;
  /** True when ordering mode is CLOSED: the app only shows the menu, no login/cart. */
  isViewOnly: boolean;
  formatPrice: (value: number) => string;
  refreshSettings: () => Promise<ClientSettings>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: ClientSettings;
}) => {
  const [settings, setSettings] = useState<ClientSettings>(initialSettings);
  const [now, setNow] = useState<Date>(() => new Date());
  const { i18n } = useTranslation();
  const locale = intlLocale(i18n.language);

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) return settings;
      const data = (await res.json()) as ClientSettings;
      setSettings(data);
      setNow(new Date());
      return data;
    } catch {
      return settings;
    }
  }, [settings]);

  // Keep settings in sync with the backend (mode/schedule may change during the event)
  useEffect(() => {
    const id = setInterval(refreshSettings, SETTINGS_REFETCH_INTERVAL);
    return () => clearInterval(id);
  }, [refreshSettings]);

  // Re-evaluate the schedule as time passes (e.g. enable sending at opening time)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const orderingStatus = useMemo(() => getOrderingStatus(settings, now), [settings, now]);

  const formatPrice = useCallback(
    (value: number) => formatPriceWith(value, settings.currency, locale),
    [settings.currency, locale]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        timezone: settings.timezone,
        currency: settings.currency,
        orderingStatus,
        isViewOnly: settings.ordering.mode === "CLOSED",
        formatPrice,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
