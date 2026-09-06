"use client";

import Link from "next/link";
import { MORE_NAV_ITEMS, NAV_ITEMS } from "@/components/layout/nav";
import { useStore } from "@/lib/store/AppProvider";
import { Card } from "@/components/ui";

export default function MorePage() {
  const { state } = useStore();
  const items = [...MORE_NAV_ITEMS.filter((n) => n.href !== "/profile"), NAV_ITEMS[9]];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Everything</h1>
        <p className="text-sm text-slate-500 mt-1">Every tool in the app keeps reading your recorded progress.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((n) => (
          <Link key={n.href} href={n.href} className="card !p-4 hover:border-primary/40 transition text-center">
            <div className="mx-auto h-9 w-9 flex items-center justify-center text-primary" dangerouslySetInnerHTML={{ __html: n.icon(false) }} />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2">{n.label}</div>
          </Link>
        ))}
      </div>

      <Card className="!p-5 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Soon: server sync, offline-friendly install (PWA), and adaptive mock scheduling.
        </p>
      </Card>
    </div>
  );
}