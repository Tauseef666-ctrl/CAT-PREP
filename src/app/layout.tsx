import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppProvider } from "@/lib/store/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { BootSplash } from "@/components/brand/BootSplash";

export const metadata: Metadata = {
  title: {
    default: "CAT Command — Your Complete CAT Preparation System",
    template: "%s · CAT Command",
  },
  description:
    "Your complete CAT preparation system — learn concepts, watch curated lectures, practice questions, solve PYQs, take mocks, analyze mistakes and build your preparation plan, all in one place.",
  keywords: [
    "CAT 2026",
    "CAT preparation",
    "CAT syllabus",
    "CAT mock tests",
    "CAT practice questions",
    "Quantitative Aptitude",
    "VARC",
    "DILR",
    "MBA entrance",
    "CAT planner",
  ],
  authors: [{ name: "CAT Command" }],
  openGraph: {
    title: "CAT Command — Your Complete CAT Preparation System",
    description:
      "Learn → Practice → Analyze → Revise → Test. Everything a CAT aspirant needs, in one place.",
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
        <BootSplash />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}