export type Product = {
  id: string
  /** Hangman answer — letters A–Z and spaces only */
  title: string
  price: number
  asin: string
  imageUrl: string
  category: string
}

/**
 * Sample catalog for Hangazon.
 * Images are public Unsplash product photos (not live Amazon ad/cookie pulls —
 * browsers cannot read Amazon cookies cross-origin; wire PA-API later for live ads).
 * ASINs are illustrative; replace with your Associates catalog.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'earbuds',
    title: 'WIRELESS EARBUDS',
    price: 49.99,
    asin: 'B0CXYZ0001',
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
  },
  {
    id: 'skillet',
    title: 'CAST IRON SKILLET',
    price: 34.95,
    asin: 'B0CXYZ0002',
    imageUrl:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
  },
  {
    id: 'yogamat',
    title: 'YOGA MAT',
    price: 28.0,
    asin: 'B0CXYZ0003',
    imageUrl:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80',
    category: 'Fitness',
  },
  {
    id: 'lamp',
    title: 'DESK LAMP',
    price: 39.5,
    asin: 'B0CXYZ0004',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
  },
  {
    id: 'blender',
    title: 'PERSONAL BLENDER',
    price: 59.99,
    asin: 'B0CXYZ0005',
    imageUrl:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
  },
  {
    id: 'backpack',
    title: 'TRAVEL BACKPACK',
    price: 74.0,
    asin: 'B0CXYZ0006',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    category: 'Travel',
  },
  {
    id: 'keyboard',
    title: 'MECHANICAL KEYBOARD',
    price: 89.99,
    asin: 'B0CXYZ0007',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
  },
  {
    id: 'mug',
    title: 'CERAMIC COFFEE MUG',
    price: 16.5,
    asin: 'B0CXYZ0008',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
  },
  {
    id: 'sneakers',
    title: 'RUNNING SHOES',
    price: 119.0,
    asin: 'B0CXYZ0009',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
  },
  {
    id: 'camera',
    title: 'INSTANT CAMERA',
    price: 99.95,
    asin: 'B0CXYZ0010',
    imageUrl:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
  },
  {
    id: 'candle',
    title: 'SCENTED CANDLE',
    price: 22.0,
    asin: 'B0CXYZ0011',
    imageUrl:
      'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
  },
  {
    id: 'watch',
    title: 'SMART WATCH',
    price: 149.0,
    asin: 'B0CXYZ0012',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
  },
]

export function pickRandomProduct(excludeId?: string): Product {
  const pool = excludeId
    ? PRODUCTS.filter((p) => p.id !== excludeId)
    : PRODUCTS
  return pool[Math.floor(Math.random() * pool.length)]!
}
