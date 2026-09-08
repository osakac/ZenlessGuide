import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/app";
import { SiteFooter } from "@/widgets/footer";
import { SiteHeader } from "@/widgets/header";
import "@/app/styles/globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZenlessGuide — гайды и тир-лист Zenless Zone Zero",
    template: "%s — ZenlessGuide",
  },
  description:
    "Тир-лист агентов Zenless Zone Zero и подробные гайды по билдам: оружие, драйв-диски, приоритет статов и команды.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
