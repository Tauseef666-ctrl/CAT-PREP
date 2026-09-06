# CAT Command — Aditya's Personalized CAT Prep

A personal CAT (Common Admission Test) preparation system, tailored around a 2nd-year Diploma (Mechanical/Production, BTEUP) student's schedule. Learn → Practice → Analyze → Revise → Test.

> **Personal & non-commercial.** Built for one candidate. All progress lives in the browser (localStorage), nothing is uploaded.

## The Core Idea

Most CAT apps give you content and a vague "study X hours." CAT Command instead answers one question: **"Tell me what to do next."**

Every screen reads your recorded state (topics completed, practice accuracy, mistake history, revision due dates, test bands) and generates a concrete next action with a time estimate you can actually fit into a college + Diploma day.

## Stack

- **Next.js 14** (App Router, `src/` layout) + **TypeScript**
- **Tailwind CSS** — dark/light themes via CSS variables (RGB-triplet `--primary`)
- **localStorage-persisted state** via a React context store (`useStore()`); no backend, no accounts
- **PWA** — installable manifest, service worker (offline shell + app icon)
- Zero analytical/statistical/PYQ data fabricated (see Integrity below)

## Get Started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build (used to verify every change — must stay green):

```bash
npm run build
npx tsc --noEmit
```

No `.env` is required to run. See `.env.example` if you ever add server-side integrations (e.g. mock-analysis providers, sync).

## Onboarding: run it first

`/onboarding` (5 steps: You / Time / Subjects / Style / Roadmap) builds the Study Plan used everywhere. First visit redirects here. Skipping is fine — defaults are sane.

## App Map (routes)

| Route | Purpose |
| --- | --- |
| `/` | Landing / call-to-action |
| `/onboarding` | 5-step setup → plan |
| `/dashboard` | Mission card, readiness gauge, stats, revision due, next test |
| `/today` | Today's plan runner (from `buildDailyPlan`) |
| `/learn` | Syllabus browser (`sections → chapters → topics`) |
| `/learn/[s]/[c]/[t]` | Topic detail: concept, rules, formulas, examples, self-check, revision |
| `/practice` | Question runs (free / timed), DILR set browser, mixes |
| `/reading` · `/rc-lab` | RC trainer: external-article reader + timed passage runs |
| `/pyq` | Past-year question browser (filters, reveal, bookmark, mistake log) |
| `/tests` | Mock center; `/tests/[id]` immersive exam; `/tests/[id]/analysis` |
| `/revision` | Due-for-revision queue (spaced repetition) |
| `/mistakes` | Mistake notebook + retry/master flow |
| `/quick` | Instant 10-minute practice chunk |
| `/planner` | Manual week planner fed by weakness analysis |
| `/analytics` | Trends, sectional mix, XP, habits |
| `/time-pressure` | Countdown drills to fix slow solving |
| `/challenge` | One hard question a day (+ streak) |
| `/notes` · `/formulas` | Personalized notes, formula sheet |
| `/videos` · `/resources` | Verified link bank |
| `/bookmarks` · `/search` · `/profile` · `/settings` · `/more` | Utilities |

## State & Engines

- `src/lib/store/AppProvider.tsx` — `useStore()`: all state + mutator actions.
- `src/lib/engine/planner.ts` — `buildDailyPlan`, `quickMode` (the "what's next" engine).
- `src/lib/engine/readiness.ts` — `readinessIndex`, `sectionalReadiness`.
- `src/lib/engine/metrics.ts` — `overallMetrics`, `sectionMetrics`, `topicsDueForRevision`.
- `src/lib/engine/testBuilder.ts` — `buildTest`, presets, attempt + performance band, next-test suggestion.
- `src/lib/engine/achievements.ts` — badge evaluation.
- `src/lib/content/*` — the single-content-source the engines consume.

> Route pages using `useSearchParams` are wrapped in `<Suspense>` (Next 14 prerender requirement). `useStore` triggers automatically save to localStorage.

## Content Integrity

A core rule of this project: **do not fabricate anything.** Concretely —

- **PYQs / questions / statistics / passages:** only present what is real and verifiable; nothing is invented to pad volume.
- **Videos:** entries are real resources; ever unrecommendable ones are flagged `verified:false` and link to a YouTube search rather than a guessed URL.
- **No pirated materials** — paid resources (books, courses) are named, never copied.

## Roadmap (not built)

- Server sync (Supabase) so progress isn't device-locked.
- Adaptive mock scheduling that calls for a full sit-down mock at the right band.
- Offline analytics export.

## Deploy

Ready for GitHub → Vercel. Creates a clean static/dynamic Next deployment.

---

*Made for Aditya. Keep the streak alive — the planner is always watching.* 🔥