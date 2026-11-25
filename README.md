# Hangazon

Hangman meets the storefront: zoomed product → letter scan → price score → baked Amazon Associates link.

## Catalog (no API)

Products live in `src/data/products.ts`. Each listing has:

- `title` — Amazon listing title (hangman puzzle + buy box)
- `brand`, `price`, `rating`, … — buy-box copy
- `affiliateUrl` — your Associates link (`tag=hangazon-21` on amazon.co.uk)

Edit that file to add/change SKUs. Nothing is pulled live.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Play

- **Ladder** — clear a listing to unlock the next; aisle chips filter the climb
- Goal: get as many clears as you can (streak shown in the top bar)
- Page scrolls to each newly unlocked listing
- Letter scan on the keyboard, or type the full listing title in the buy box (**Guess**)
- Correct early title guess keeps blank-slot bonus for the price score
- Fast-type: queue keys; 2→2× scan, 3→3×, …
- Out of attempts → blood / YOU DIED (streak breaks), then continue the ladder

## Stack

Vite · React · TypeScript · Framer Motion
