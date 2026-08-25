# AMBERION — Website

Static website for **Amberion Engineering Services Private Limited**, built to the
*AMBERION Website Master Build Brief v6*.

No build step, no dependencies, no framework. Plain HTML, one stylesheet, one script.
Host it anywhere that serves static files (Netlify, Vercel, Cloudflare Pages, S3, Hostinger, cPanel).

## Run locally

```bash
cd site && python -m http.server 8000
```

Then open http://localhost:8000

## Structure

```
.
├── vercel.json       Vercel config — serves site/ as the output directory
└── site/
├── index.html        Home
├── about.html        About
├── services.html     Services (3 pillars, anchored sections)
├── projects.html     Selected leadership experience
├── insights.html     Insights (planned editorial programme)
├── careers.html      Careers
├── contact.html      Contact + enquiry form + map
├── 404.html          Branded not-found page
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css  Full design system (tokens, components, responsive, a11y)
    ├── js/main.js     Nav, scroll reveal, sticky header, enquiry form
    └── img/           Drop photography here
```

## Design system

All brand values live as CSS custom properties at the top of `assets/css/style.css`:

| Token | Hex | Role |
|---|---|---|
| `--charcoal` | `#202522` | Primary — logo, headings, nav |
| `--forest` | `#0B5D4B` | Secondary — buttons, highlights, icons |
| `--amber` | `#B58A3A` | Accent — numbers, fine details, hover |
| `--warm-white` | `#F7F6F2` | Background |
| `--soft-grey` | `#D9DDD9` | Borders, dividers, cards |

Colour balance follows the brief: roughly 70% warm white, 20% charcoal, 8% forest, 2% amber.
The logo is wordmark-only — no icon, no gradient, no suffix.

Typeface is **Inter** (Google Fonts) with a system sans fallback. To self-host, drop the
font files into `assets/` and replace the `<link>` in each page `<head>` with an `@font-face` block.

## Content still to supply

Everything below is deliberately left as a marked placeholder — the brief prohibits inventing
credentials, memberships, metrics or contact details. Search the HTML for `[Insert` to find them all.

- `about.html` — verified biographies, credentials and individual memberships for **Pradeep C.S.** and **Theju L.C.**
- `about.html` — confirmed AMBERION *organisational* memberships (kept separate from individual credentials)
- `careers.html` — confirmed open roles
- `contact.html` — GSTIN; exact map pin
- `assets/img/` — leadership portraits, project photography, engineering/BIM imagery

Project cards and stat blocks are already labelled **Selected leadership experience** with an
explicit disclaimer, per the brief's rule that historical projects must not read as
AMBERION-delivered company projects.

## Enquiry form

`contact.html` has no backend. On submit, `main.js` validates the fields and hands the enquiry
to the visitor's mail client via `mailto:info@amberion.in`, so nothing is silently dropped.

To wire a real endpoint, replace the submit handler in `assets/js/main.js` with a `fetch()` POST
to your form service (Formspree, HubSpot, or a custom API), and change the `<form>` element's
`data-enquiry-form` handling accordingly. The recipient address is set on the form element
via `data-mailto`.

## Before going live

1. Fill every `[Insert …]` placeholder.
2. Add real photography to `assets/img/` and swap the grey placeholder blocks.
3. Confirm the domain in `sitemap.xml`, `robots.txt` and each page's `<link rel="canonical">`
   and Open Graph tags (currently `https://www.amberion.in/`).
4. Add an Open Graph share image (`assets/img/og.jpg`, 1200×630) and reference it with
   `<meta property="og:image">`.
5. Add analytics if required.
6. Re-run the link check and test on a real mobile device.

## Deployment

Deployed on Vercel from the `main` branch of `RN98800/AMBERION` (private repo).
`vercel.json` at the repo root pins `outputDirectory` to `site`, so `/` serves
`site/index.html`. Pushing to `main` triggers a redeploy.

Live: https://amberion.vercel.app

This README lives at the repo root, deliberately outside `site/`, so it is not
published as part of the website.
