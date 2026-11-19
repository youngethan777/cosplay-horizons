# Cosplay Horizons — Deploy Checklist

Tick each box as you go. Do not point the domain at Vercel until the
boxes above it are done.

## Accounts (done Nov 16, 2026)
- [x] Domain bought: cosplayhorizons.com (Porkbun, $11.81/yr)
- [x] Vercel account created (Personal / Hobby)
- [x] Supabase account created
- [x] GitHub account created
- [x] Prototype tested: 6 real photos in, search / detail / submit / takedown checked

## Code
- [x] Real site built in `~/workspace/cosplay-horizons/` (Next.js + Supabase)
- [x] `npm run build` passes
- [x] 6 real photos verified (Naofumi, Neptune, Ray, Wizard, Link, Izaya)
- [x] 7 placeholders remain (Leon ×2, Agate ×2, Akihiko, Ryusui, Satoshi)

## 1. GitHub
- [ ] Create repo `cosplay-horizons` on GitHub (do not add a README there)
- [ ] Push this code to `main`

## 2. Vercel (Personal / Hobby — free)
- [ ] Import `cosplay-horizons` repo into Vercel, framework Next.js
- [ ] Deploy — note the Vercel URL (e.g. `cosplay-horizons.vercel.app`)
- [ ] Open the Vercel URL: gallery loads, search “Agate” returns exactly 2

## 3. Supabase
- [ ] Create project `cosplay-horizons`
- [ ] SQL Editor: run `supabase/schema.sql`
- [ ] SQL Editor: run `supabase/seed.sql`
- [ ] Table Editor → `cosplays` shows 13 rows
- [ ] Storage: create public bucket `cosplay-photos`, 8 MB limit, JPG/PNG/WebP/GIF only
- [ ] Copy Project URL, anon key, service_role key from Settings → API

## 3b. v1.1 migration (existing live project only — run before redeploy)
- [ ] Supabase → SQL Editor: run `supabase/migration-2026-11-18-multi-photo-variants.sql`
- [ ] Verify: `select variant_type, count(*) from public.cosplays group by variant_type;` → 12 traditional + 1 other (Cupsleeve)
- [ ] Verify: the 6 rows with a photo each have `photo_urls` with exactly 1 entry
- [ ] (Fresh databases skip this — `supabase/schema.sql` already includes the new columns)

## 4. Connect Vercel ↔ Supabase
- [ ] Vercel → Settings → Environment Variables, add:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server only)
- [ ] Redeploy in Vercel
- [ ] On the Vercel URL: search, detail page, submit a test photo, send a test takedown — all work and appear in Supabase

## 5. The other 7 photos
- [ ] Submit Leon (concert), Leon (AX), Agate (cupsleeve), Agate (AX), Akihiko, Ryusui, Satoshi via the **live** submission form
- [ ] Approve each in Supabase and add it to `cosplays`
- [ ] Gallery shows all 13 with real photos, no placeholders left (unless Ethan wants some held back)

## 6. Trust pages
- [ ] Read `/privacy`, `/terms`, `/takedown` on the live site
- [ ] (Optional, recommended before public launch) have a lawyer review them

## 7. Domain (only when steps 1–6 are done)
- [ ] Vercel → Settings → Domains → add `cosplayhorizons.com` (+ `www` if wanted)
- [ ] Porkbun → DNS → add the records Vercel shows (do NOT buy Porkbun hosting)
- [ ] https://cosplayhorizons.com loads with SSL

## 8. Soft launch, then public
- [ ] Invite 2–3 friends to submit + search; fix confusing bits
- [ ] Google Search Console: add `cosplayhorizons.com`, submit `/sitemap.xml`
- [ ] Announce in SoCal / friends circle

## Later (do NOT do at launch)
- [ ] Light ads only at ~10k monthly pageviews / 200+ profiles, 1–2 per page, no pop-ups — and only then upgrade Vercel to Pro ($20/mo) and Supabase to Pro ($25/mo) if needed
- [ ] Claimable profiles / accounts only at ~20–30 profiles, if contributors ask to edit their own
