# Bournemouth Dance

A fully static (SSG) Next.js directory of weekly social dance classes in
Bournemouth, Poole and Christchurch — [bournemouthdance.co.uk](https://bournemouthdance.co.uk).

## Stack

- Next.js (App Router) + TypeScript, pre-rendered to static HTML at build
  time — no database, auth or server runtime required.
- Tailwind CSS v4 (tokens defined in `app/globals.css`).
- Listings data lives in `data/listings.json`, generated from
  `data/listings-source.csv` by `scripts/import-listings.ts`. All reads go
  through `lib/listings.ts`, so swapping JSON for a CMS or database later
  only means rewriting that one file.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Updating listings

The source of truth is `data/listings-source.csv` (one row per class).
Columns: `ID, Provider, Class name / detail, Style, Day, Start time, Venue,
Town, Level, Price (£), Website / contact, Source, Status, Notes`.

- Only rows with `Status` = `Confirmed` appear on the live site. Use
  `To verify` for anything you haven't double-checked yet, and `Inactive`
  for classes that have stopped running — both are excluded at build time
  but kept in the data for reference.
- `Style` can hold more than one style separated by `/` (e.g.
  `Kizomba / Urban Kiz`) — the class will appear on both style pages.

To publish a change:

1. Edit `data/listings-source.csv` (open it in a spreadsheet app, or edit
   it directly — it's plain CSV).
2. Regenerate `data/listings.json`:
   ```bash
   npm run import-listings
   ```
3. Commit the updated CSV and JSON, then deploy (push to the branch Vercel
   watches, or run `vercel --prod`).

Every page — home, style, venue and class pages, the sitemap — is
generated from this one file at build time, so there's nothing else to
update by hand.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel, "Add New Project" → import the repo. Framework preset
   `Next.js` is detected automatically; no extra config or environment
   variables are needed for v1.
3. Deploy. Every push to the production branch rebuilds the static site.

### Pointing the domain

1. In the Vercel project → **Settings → Domains**, add
   `bournemouthdance.co.uk` (and `www.bournemouthdance.co.uk` if you want
   the `www` form to work) and follow Vercel's DNS instructions (an `A`/
   `ALIAS` or `CNAME` record at your DNS provider).
2. Add `bournemouthdance.com` as a second domain on the same project, and
   set it to **redirect** to `bournemouthdance.co.uk` — Vercel's domain
   settings have a "Redirect to another domain" option that issues a
   permanent (301) redirect, so point the DNS for `.com` at Vercel the
   same way and flip that switch.
3. Update `SITE_URL` in `lib/site.ts` if the production domain ever
   changes — it feeds canonical URLs, the sitemap and JSON-LD.

## Before going live

- `lib/site.ts` has a placeholder `CONTACT_EMAIL` — point it at whichever
  inbox should receive "list my class" emails.
- There's no `app/favicon.ico` yet — drop one in to replace the browser
  default.
# bomo-dance-directory
