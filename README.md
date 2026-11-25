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

- **Daily** — date-hashed aisle + listing
- **Random** — aisle chips filter the catalog
- Fast-type: queue keys; 2→2× scan, 3→3×, …

## Stack

Vite · React · TypeScript · Framer Motion
