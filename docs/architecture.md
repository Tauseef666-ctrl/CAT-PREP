# CAT Command — Accounts, Sync, CMS & Content-Verification Architecture

Status: **Design proposal** (spec §48–51). No backend is built yet. The app is intentionally
self-contained (localStorage-first, zero backend, deployable anywhere static) — this doc defines
the paths to add accounts, cross-device sync, and an editorial CMS **without** breaking that property.

## 1. Goals
- §48 **Accounts & sync**: sign-up/sign-in; study state (plan, progress, results, notes) synced
  across devices; privacy-first (per-user data, export & delete).
- §49 **Database entities**: a schema that maps 1:1 to the current `AppState` type in
  `src/lib/types.ts` plus CMS tables, so no client rewrite is needed.
- §50 **CMS**: a small editorial workflow to manage syllabus, questions, resources, videos, notes
  and announcements — authored in production, quality-gated.
- §51 **Resource verification dashboard**: a review queue that marks each resource/question as
  `verified` or `needs-review` (mirrors the existing `verified:false` UI pattern from §53).

## 2. Non-goals (for now)
- Real-time collaborative editing, paid billing, complex role/permission hierarchies.
- Migrating existing localStorage users automatically — we provide a **one-time import** instead.

## 3. Principles
- **Client stays generic**: the app persists through the existing `useStore()` abstraction
  (`src/lib/store/AppProvider.tsx`, key `catcommand:state:v1`). A sync adapter sits underneath and
  reads/writes the same `AppState` shape.
- **No fabricated content**: the verification workflow exists precisely so unverified content is
  labelled `verified:false` and never implied as real (matches existing content rules).
- **Static-first**: all public pages remain statically rendered; only `/dashboard`, `/learn/...`,
  `/practice`-style routes opt into auth-gated SSR/data-fetching.

## 4. Data model (SQL — Postgres)

### 4.1 App state (mirrors client `AppState`)
```
users            id, email, display_name, created_at, last_seen_at
profiles         id, user_id FK, name, bio, course, college, city, board,
                 target_year, avatar_url, updated_at          -- mirrors Profile
plans            id, user_id FK, prep_level, prep_style, target_percentile, daily_minutes,
                 days_per_week, focus_mode, strong_sections[], weak_sections[],
                 strong_topics[], weak_topics[], settings JSONB, updated_at   -- mirrors StudyPlan
topic_progress   user_id, topic_id, status, concept_learned, examples_done, videos_watched[],
                 revision_count, next_revision_at, updated_at, PK (user_id, topic_id)
question_results user_id, question_id, correct, selected, time_spent_ms, section, attempted_at
test_attempts    user_id, test_id, submitted_at, answers JSONB, score JSONB, report JSONB
sessions         user_id, date, type, topic_id, duration_min, items_completed, created_at
study_days       user_id, date, completed_minutes, completed_tasks, PK (user_id, date)
streaks          user_id, current, longest, last_activity_date, updated_at
bookmarks        user_id, item_kind (topic|question|formula|video|resource), item_id,
                 created_at, PK (user_id, item_kind, item_id)
notes            user_id, id, topic_id, title, body, updated_at, pinned
mistakes         user_id, id, question_id, topic_id, why_feedback, date, resolved
settings         user_id, key, value JSONB, updated_at, PK (user_id, key)
```

### 4.2 CMS
```
content_items      id, slug, kind (section|chapter|topic|question|formula|video|resource),
                   payload JSONB, version, status (draft|published|archived), verified BOOLEAN,
                   verified_by, verified_at, created_by, created_at, updated_at
revisions          id, item_id, author_id, payload JSONB, note, created_at
review_queue       id, item_id, state (pending|approved|rejected), reviewer_id,
                   comment, created_at, decided_at
announcements      id, title, body, published_at, status
media_assets       id, kind (image|pdf|video|link), url, title, creds, checksum,
                   verified, verified_by, verified_at, created_at
seo_pages          id, route, payload JSONB (head/content), published, updated_at  -- §59 CMS-driven pages
```

## 5. Auth
- **Stack**: Supabase Auth (email + OAuth), a single `anon`/`service_role` split, Row Level
  Security (RLS) enabled on every user table; `city`/personal fields only readable/writable by owner.
- Sign-up flow: optional; on first login the client offers **one-time import** of the local
  `catcommand:state:v1` blob (merge policy: server wins per field updated_at, local wins for drafts).
- Session survives via Supabase refresh tokens; `localStorage` remains the offline cache.

## 6. Sync strategy
- **Write-behind**: mutations update localStorage immediately (app stays instant), then enqueue to a
  local sync queue and flush via `PATCH`. Conflict resolution: field-level `updated_at` (last-write-wins)
  with a per-user conflict log surfaced in Settings.
- Tables synced per-user: plans, topic_progress, question_results (append-only), test_attempts,
  sessions, study_days, bookmarks, notes, mistakes, settings.
- Read-mostly (versioned, server-authoritative): syllabus, questions, formulas, videos, resources —
  pulled from the CMS and cached; the `content_version` bump invalidates cache.

## 7. CMS & content pipeline
- Editor UI (`/admin`) is a separate Next.js route group protected by an `is_admin` claim.
- All content is authored as JSONB drafts, versioned in `revisions`, and **published atomically**:
  publish writes a new row + flips `status`, and the client only loads `status = published`.
- `verified` flag is manual (human-reviewed): content without a reviewer's sign-off ships with
  `verified:false` styling (amber "unverified" chip + search link) exactly as today.
- Editorial checklist for a **resource/video**: source URL reachable → title matches → author/creds
  present → content reviewed for accuracy → mark verified. Each step logged in `review_queue`.

## 8. Resource verification dashboard (v2 of §51)
- `/admin/verify` lists `review_queue` items grouped by `state`, with previews of the payload and a
  decision form (approve/reject + comment). Rejection goes back to the editor via `review_queue.comment`.
- Metrics per reviewer: items/day, avg review time, approval rate (no public ranking — internal only).

## 9. Security & privacy
- RLS everywhere; never expose `profiles` PII in any public route; export = user downloads JSON;
  delete = cascade + queue purge within 30 days; audit log in `review_queue`/`revisions`.

## 10. Rollout phases
1. **P0 (now)**: static, localStorage-first app — current state.
2. **P1**: Supabase project + schema migration + RLS; auth screens; sync adapter under `useStore`;
   one-time import; keep full offline PWA behavior.
3. **P2**: `/admin` CMS (topics, questions, resources, notes, announcements, SEO pages) with
   publish pipeline; content_version cache invalidation.
4. **P3**: resource verification dashboard + editorial workflow + content metrics.
5. **P4** (optional): leaderboards/streaks social, email digests (weekly report email from §43).

## 11. Decisions still open
- Whether plan/profile personalization stays server-side or remains client-only merged into sync.
- Notification channel (in-app only vs email) for revision-due and weekly reports.
- Backups/export format (JSON today; zip with media later).