# Hangazon

Hangman meets the storefront: zoomed product → letter scan → price score → Amazon Associates link.

## Live Amazon listings

Browsers **cannot** read Amazon cookies or scrape the storefront. Real listings use the official **Product Advertising API (PA-API 5.0)** on the server.

Set these secrets (never in client code):

| Secret | What |
| --- | --- |
| `AMAZON_PAAPI_ACCESS_KEY` | PA-API access key |
| `AMAZON_PAAPI_SECRET_KEY` | PA-API secret key |
| `AMAZON_ASSOCIATE_TAG` | Associates tracking id (`yourtag-20`) |

Optional: `AMAZON_MARKETPLACE` (default `www.amazon.com`).

Without credentials the app uses the **sample catalog** and still plays fine.

## Develop

```bash
npm install
npm run dev          # Vite + /api middleware
```

```bash
npm run build
npm start            # static dist + /api on :8787
```

## Play

- **Daily** — date-hashed aisle + listing (same day = same product when live)
- **Random** — aisle chips filter the search
- Fast-type: queue keys; 2→2× scan, 3→3×, …

## Stack

Vite · React · TypeScript · Framer Motion · amazon-paapi
