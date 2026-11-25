export const CATEGORIES = [
  'Electronics',
  'Kitchen',
  'Home',
  'Fitness',
  'Travel',
  'Fashion',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Product = {
  id: string
  /** Hangman answer — letters A–Z and spaces only */
  title: string
  price: number
  asin: string
  imageUrl: string
  category: Category
  /** PA-API DetailPageURL when live */
  detailUrl?: string | null
}

/**
 * Sample catalog. Category logic: department aisle the listing would sit in.
 * Daily mode rotates category by date, then picks one SKU in that aisle.
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
    id: 'keyboard',
    title: 'MECHANICAL KEYBOARD',
    price: 89.99,
    asin: 'B0CXYZ0007',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
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
    id: 'watch',
    title: 'SMART WATCH',
    price: 149.0,
    asin: 'B0CXYZ0012',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
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
    id: 'blender',
    title: 'PERSONAL BLENDER',
    price: 59.99,
    asin: 'B0CXYZ0005',
    imageUrl:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
  },
  {
    id: 'kettle',
    title: 'ELECTRIC KETTLE',
    price: 42.0,
    asin: 'B0CXYZ0013',
    imageUrl:
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
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
    id: 'mug',
    title: 'CERAMIC COFFEE MUG',
    price: 16.5,
    asin: 'B0CXYZ0008',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
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
    id: 'yogamat',
    title: 'YOGA MAT',
    price: 28.0,
    asin: 'B0CXYZ0003',
    imageUrl:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80',
    category: 'Fitness',
  },
  {
    id: 'dumbbells',
    title: 'HEX DUMBBELLS',
    price: 54.0,
    asin: 'B0CXYZ0014',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    category: 'Fitness',
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
    id: 'duffel',
    title: 'WEEKENDER BAG',
    price: 68.0,
    asin: 'B0CXYZ0015',
    imageUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Travel',
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
    id: 'cap',
    title: 'BASEBALL CAP',
    price: 24.0,
    asin: 'B0CXYZ0016',
    imageUrl:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
  },
]

export type CategoryFilter = Category | 'All'

export function productsIn(filter: CategoryFilter): Product[] {
  if (filter === 'All') return PRODUCTS
  return PRODUCTS.filter((p) => p.category === filter)
}

export function pickRandomProduct(
  filter: CategoryFilter = 'All',
  excludeId?: string,
): Product {
  const pool = productsIn(filter).filter((p) => p.id !== excludeId)
  const list = pool.length > 0 ? pool : productsIn(filter)
  return list[Math.floor(Math.random() * list.length)]!
}
