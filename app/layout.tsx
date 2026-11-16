import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/context/SettingsContext";
import { OrderingStatusDialog } from "@/components/OrderingStatusDialog";
import { getSettings } from "@/services/settings.service";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MyClienti",
  description: "MyClienti - MySagra's client app",
  // Tell Google Chrome / Google Translate not to offer automatic translation:
  // the app has its own IT/EN translation and menu names must stay as entered.
  other: { google: "notranslate" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    // translate="no" + "notranslate" class: block browser auto-translation (Chrome, Safari, Edge…).
    // lang is updated on the client by I18nProvider to the language actually shown.
    <html lang="it" translate="no" className="notranslate" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased notranslate`}
        translate="no"
      >
        <I18nProvider>
          <SettingsProvider initialSettings={settings}>
            <CartProvider>
              {children}
              <OrderingStatusDialog />
              <Toaster position="top-center" richColors />
            </CartProvider>
          </SettingsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
