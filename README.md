# Hangazon

Hangman meets the storefront: a zoomed product drops in, you guess letters to reveal the listing title, then score the price from **0–100%**. After the round, an Amazon Associates affiliate link lets players open the listing (and earns you referral credit).

## Play loop

1. **Letters** — type A–Z (or tap the keyboard). Hits fill the title; misses draw the gallows and pull the zoom back a notch.
2. **Price** — after a win or 6 misses, guess the sticker price.
3. **Reveal** — see accuracy, then open the affiliate listing.

## Product data

Browsers **cannot** pull Amazon ads from cookies or ad pixels (cross-origin). This build ships a **sample catalog** in `src/data/products.ts`.

To go live with real listings:

1. Join [Amazon Associates](https://affiliate-program.amazon.com/) and set your tag in `src/lib/affiliate.ts` (`ASSOCIATE_TAG`).
2. Replace ASINs / titles / prices / images with your catalog, **or** add a server that calls the [Product Advertising API](https://webservices.amazon.com/paapi5/documentation/) and returns sanitized product DTOs (never ship PA-API secrets to the browser).

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Framer Motion
