# Cosplay Horizons

**Find the cosplayer, not the costume shop.**

A searchable, Pinterest-style cosplay database — an endless horizon of
different characters and different worlds, as far as the eye can see.

- Search by character **or** cosplayer, filter by series and by variant
- Up to 5 photos per look (first = cover), with variant tags:
  Traditional, Christmas, Halloween, or Other (with a custom name)
- Every look credits the cosplayer (and photographer, when known) with
  social links right there
- Opt-in only: cosplayers submit their own photos; anyone can ask for a
  photo to be removed within 48 hours
- **No ads, no pop-ups, no autoplay, no subscription.** Submissions-only —
  no logins/accounts in v1.

Live domain (once deployed): **https://cosplayhorizons.com**
(domain already bought on Porkbun — do NOT buy Porkbun hosting; the
domain just needs its DNS pointed at Vercel, step 5 below.)

## Branding (v1.1, Nov 18 2026)

- Colours: turquoise blue / sky blue (`#0ea5e9`, `#0e7490`) paired with
  emerald green (`#059669`, `#047857`), in `src/app/globals.css`.
- Logo: `public/logo.svg` — a simple sun-over-horizon mark in those
  colours, with the "Cosplay Horizons" wordmark (`src/components/Logo.tsx`).
  It is also the favicon. No mascot yet.
- Landing page: the homepage explains the site first, then shows an
  endless gliding cycle of the 6 real photos (`src/components/PhotoMarquee.tsx`).
  The gallery/search below is unchanged.

## What is in this repo

| Path | What it is |
|---|---|
| `src/app/page.tsx` + `src/components/Gallery.tsx` | Home gallery, search + series filter |
| `src/app/cosplay/[id]/page.tsx` + `src/components/PhotoViewer.tsx` | Detail view: photo viewer (prev/next, counter, thumbnails), variant tag, credit, event/date, photographer, Instagram link |
| `src/app/submit/page.tsx` + `src/components/SubmitForm.tsx` | Submit form — up to 5 photo **uploads** (JPG/PNG/WebP/GIF, 8 MB each), reorder/remove/pick cover, variant selection, consent required, optional photographer |
| `src/components/Logo.tsx`, `public/logo.svg` | Logo (wordmark + sun-over-horizon mark, sky blue/turquoise + emerald); also the favicon. No mascot yet — that is a later idea. |
| `src/components/PhotoMarquee.tsx` | Landing-page endless photo cycle (the 6 real photos, looped, pauses on hover) |
| `src/app/takedown/page.tsx` + `src/components/TakedownForm.tsx` | Takedown form, pre-filled from any entry, 48-hour promise |
| `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` | Trust pages |
| `src/lib/data.ts` | Seeded v1 data — 13 entries (6 real photos, 7 placeholders) |
| `public/photos/` | The 6 real photos, resized to max 1200 px, ~110–320 KB each |
| `supabase/schema.sql`, `supabase/seed.sql` | Database tables, RLS, seed data, storage bucket notes |
| `supabase/migration-2026-11-18-multi-photo-variants.sql` | **v1.1 migration for the existing live project** — run in Supabase SQL Editor before the next redeploy (see §3). Fresh databases do not need it; `schema.sql` already includes the new columns. |
| `.env.example` | Env vars to copy — **no real keys in this repo** |

### The 13 seeded entries

1. Leon Strohl — Metaphor: ReFantazio — Metaphor concert Oct 14, 2026
2. Leon Strohl — Metaphor: ReFantazio — Anime Expo 2026
3. Agate Crosner — Trails in the Sky — Trails cupsleeve Sep 20, 2026 ★ favourite
4. Agate Crosner — Trails in the Sky — Anime Expo 2026
5. Akihiko Sanada — Persona 3 — AX 2026
6. Ryusui Nanami — Dr. Stone — AX 2026
7. Naofumi Iwatani — The Rising of the Shield Hero — **real photo**
8. Neptune — RWBY — **real photo**
9. Satoshi Isshiki — Food Wars!
10. Ray Cro Glamor — D&D original — **real photo**
11. Kamen Rider Wizard — Kamen Rider Wizard — **real photo**
12. Link — The Legend of Zelda — **real photo**
13. Izaya Orihara — Durarara!! — first cosplay, AX 2016 — **real photo**

Photo mapping was verified visually — the green-cape shield photo is
**Naofumi** (not Leon) and the blue-hair trident photo is **Neptune**
(not Ryusui). Do not re-map them without Ethan's say-so.

## Preview without Supabase (works right now)

The site works with **no env vars set**: it falls back to the seeded
local data in `src/lib/data.ts`. Submissions and takedowns are validated
in full, but in preview mode they are acknowledged, not saved — the form
says so. Connect Supabase to save them.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass before deploying
```

## Deploy — exact steps for Ethan

### 1. Create the GitHub repo and push this code

1. On GitHub, create a new **public or private** repo named `cosplay-horizons`.
   Do not initialise it with a README — this code already has one.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Cosplay Horizons v1"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/cosplay-horizons.git
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username.

### 2. Import to Vercel as a Personal / Hobby project

1. Go to Vercel → **Add New → Project** → **Import** the
   `cosplay-horizons` repo from GitHub.
2. Framework preset: **Next.js** (it should be detected automatically).
3. Team / account: **Personal** — Hobby plan, free. This is for
   non-commercial personal projects, which is what this is right now.
   **Upgrade to Pro ($20/month) only when you turn on ads** — Vercel
   counts ads, including AdSense, as commercial use.
4. Click **Deploy**. You will get a Vercel URL like
   `cosplay-horizons.vercel.app`. Test everything there first — do not
   point the domain at it yet.

### 3. Create the Supabase project, run the schema, set env vars

1. In Supabase, create a new project named `cosplay-horizons`
   (pick a region near you, e.g. US West).
2. Go to **SQL Editor → New query**, paste `supabase/schema.sql`, Run.
   Then a new query, paste `supabase/seed.sql`, Run.
   Check **Table Editor → cosplays** shows 13 rows.

> **v1.1 — existing live project only:** the live project was created
> from the v1 schema, so before the next redeploy, run
> `supabase/migration-2026-11-18-multi-photo-variants.sql` in the SQL
> Editor too. It adds `photo_urls`, `photo_paths`, `photo_file_names`,
> `variant_type` and `variant_label`, backfills them from the
> single-photo columns, backfills `main_series`, and sets id 3 (Agate,
> Trails cupsleeve) to variant `other` / `Cupsleeve` (12 traditional +
> 1 other), and adds a `variant_type` index. It is safe to re-run. Then
> verify with:
> `select variant_type, count(*) from public.cosplays group by variant_type;`
> — expect 12 traditional + 1 other (id 3, Cupsleeve). Do **not** run it on a fresh database.
3. Go to **Storage → New bucket**:
   - Name: `cosplay-photos`
   - Public bucket: **ON**
   - File size limit: **8 MB**
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`
4. Get your keys in Supabase → **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (server only — never put it in a `NEXT_PUBLIC_*` variable.)
5. In Vercel → your project → **Settings → Environment Variables**,
   add those three, for **Production** (and Preview if you like).
6. **Redeploy** in Vercel (Deployments → ⋯ → Redeploy) so the new
   env vars take effect.
7. Test on the Vercel URL: search “Agate” (should return exactly 2),
   open a detail page, submit a test photo, send a test takedown.

> **Supabase Free plan notes:** 500 MB database, 1 GB file storage,
> and the project **pauses after 7 days of inactivity** — you can
> un-pause it from the dashboard. Pro is $25/month, no pausing,
> 8 GB database / 100 GB storage. For a soft launch with friends, Free
> is fine. Upgrade to Pro before a public launch.

### 4. Test the other 7 photos via the live submission form

The 7 entries still on placeholders are Leon ×2, Agate ×2, Akihiko,
Ryusui, and Satoshi. Submit them through the **live** submission form
on the Vercel URL (not the prototype), approve them in Supabase →
Table Editor → `submissions` (change `status` to `approved` and add a
matching row to `cosplays`), and check they appear in the gallery.

### 5. Point cosplayhorizons.com at Vercel (only when ready)

1. In Vercel → your project → **Settings → Domains** → add
   `cosplayhorizons.com` (and `www.cosplayhorizons.com` if you want it).
   Vercel will show you the DNS records it needs.
2. In Porkbun → your domain → **DNS**, add the records Vercel shows
   you (usually an `A` record and/or a `CNAME` for `www`).
   Do **not** buy Porkbun hosting — DNS pointing is all you need.
3. Wait for DNS to propagate (usually minutes, sometimes a few hours),
   then open https://cosplayhorizons.com and check it loads with SSL.
   Vercel provides the SSL certificate automatically.

### 6. Soft launch, then public

- Invite 2–3 friends to submit and search. Fix anything confusing.
- Then open it up in SoCal, and in Google Search Console add
  `cosplayhorizons.com` and submit the sitemap at
  `https://cosplayhorizons.com/sitemap.xml` so character pages can
  start showing up in Google.

See `DEPLOY_CHECKLIST.md` for a tick-box version of all of this.

## Costs (as of Nov 2026)

- Domain: $11.81/year (Porkbun, already bought)
- Vercel Hobby + Supabase Free: **$0/month** to start
- Paid production (only when ads / always-on are needed):
  Vercel Pro $20 + Supabase Pro $25 = **~$45/month**
- At ~10,000 monthly visitors, expect ~$45/month on this stack if
  images stay compressed/cached — not hundreds. Hundreds would only
  come at ~50k+ visitors, unoptimised full-size photos, or many paid
  team seats. A cheaper long-term option for photo-heavy traffic is
  Cloudflare Pages + R2 — the site is not locked in; the domain can
  be re-pointed.

## Tech

Next.js 14 (App Router, TypeScript) · React 18 · Supabase
(Postgres + Storage) · Vercel hosting · Mobile-first, no ads.
