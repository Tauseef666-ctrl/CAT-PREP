"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MOBILE_NAV, MORE_NAV_ITEMS, NAV_ITEMS } from "./nav";
import { useStore } from "@/lib/store/AppProvider";
import { Logo } from "@/components/brand/Logo";

const SHELL_FREE = new Set(["/", "/onboarding", "/syllabus"]);

function renderIcon(svg: string) {
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStore();
  const inTest = pathname?.startsWith("/tests/");
  const free = SHELL_FREE.has(pathname ?? "") || inTest;

  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setStreak(state.streak.current);
    setXp(state.xp);
  }, [state.streak, state.xp]);

  if (free) return <>{children}</>;

  const activeHref = pathname ?? "";
  const activeItem = NAV_ITEMS.find(
    (n) => activeHref === n.href || activeHref.startsWith(n.href + "/")
  );

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 h-14">
          <Link href="/dashboard" aria-label="CAT Command dashboard">
            <Logo wordmark size={24} />
          </Link>
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-0.5 text-xs">
              <span className="px-2 py-1 rounded-lg flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">🔥 {streak}</span>
              <span className="px-2 py-1 rounded-lg flex items-center gap-1 text-primary font-semibold">⭐ {xp} XP</span>
            </div>
            <Link
              href="/search"
              aria-label="Global search"
              className="btn-ghost !px-2.5"
            >
              <svg className="h-4.5 w-4.5 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            </Link>
            <Link href="/bookmarks" aria-label="Bookmarks" className="btn-ghost !px-2.5">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop nav */}
      <nav className="hidden lg:block sticky top-14 z-30 border-b border-slate-200/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-stretch gap-1 px-4 overflow-x-auto">
          {NAV_ITEMS.map((n) => {
            const active = activeHref === n.href || activeHref.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition",
                  active
                    ? "text-primary border-primary bg-primary/5"
                    : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                {renderIcon(n.icon(active))}
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-5 pb-28 lg:pb-12">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden glass border-t border-slate-200/60 dark:border-slate-700/50 safe-bottom"
        aria-label="Primary"
      >
        <div className="flex items-stretch">
          {MOBILE_NAV.map((n) => {
            const active = activeHref === n.href || activeHref.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition",
                  active ? "text-primary" : "text-slate-500 dark:text-slate-400"
                )}
              >
                {renderIcon(n.icon(active))}
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}