import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppProvider } from "@/lib/store/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "CAT Command — Aditya's Personalized CAT Prep",
    template: "%s · CAT Command",
  },
  description:
    "CAT Command is Aditya's personal CAT preparation system — learn concepts, practice, revise, take tests and let the intelligent planner tell you exactly what to do next.",
  keywords: ["CAT 2026", "CAT preparation", "CAT planning", "MBA", "Quantitative Aptitude", "VARC", "DILR", "Aditya"],
  authors: [{ name: "CAT Command" }],
  openGraph: {
    title: "CAT Command — Aditya's Personalized CAT Prep",
    description:
      "Learn → Practice → Analyze → Revise → Test. Your personal CAT preparation system designed around college and Diploma study time.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CAT Command" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CAT Command" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}