"use client";

import { useState } from "react";
import { RESOURCES, CAT_PAST_PAPERS } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function ResourcesPage() {
  const [freeOnly, setFreeOnly] = useState(false);
  const list = RESOURCES.filter((r) => (freeOnly ? r.free : true));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Resources</h1>
        <p className="text-sm text-slate-500 mt-1">
          Books, sites and courses — recommended with integrity. No pirated material, ever.
        </p>
      </div>

      <button className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setFreeOnly((v) => !v)}>
        {freeOnly ? "✓ Free only" : "Show free only"}
      </button>

      {list.length === 0 ? (
        <EmptyState title="No resources yet" description="Resources are vetted before being recommended." />
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <Card key={r.id} className="!p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{r.name}</div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Chip tone="neutral">{r.category}</Chip>
                    {r.free ? <Chip tone="green">Free</Chip> : <Chip tone="amber">Paid</Chip>}
                    {!r.verified && <Chip tone="amber">verify</Chip>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{r.note}</p>
                </div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1.5 text-xs shrink-0">
                    Visit ↗
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Previous-Year CAT Papers</h2>
        <p className="text-sm text-slate-500 mt-1">
          Official/memory-based past papers we verified live — every link serves a real PDF.
        </p>
      </div>
      <div className="space-y-3">
        {CAT_PAST_PAPERS.map((r) => (
          <Card key={r.id} className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-slate-100">{r.name}</div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <Chip tone="neutral">{r.category}</Chip>
                  <Chip tone="green">Free</Chip>
                  <Chip tone="green">✓ verified PDF</Chip>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{r.note}</p>
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-1.5 text-xs shrink-0">
                PDF ↗
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}