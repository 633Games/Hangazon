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
  /** Longer storefront-style name for the reveal buy box */
  listingTitle: string
  brand: string
  price: number
  /** Optional strikethrough “was” price */
  listPrice?: number
  rating: number
  reviews: number
  prime?: boolean
  blurb: string
  asin: string
  imageUrl: string
  category: Category
  /** Baked Associates link with tag=hangazon-21 */
  affiliateUrl: string
}

function affiliateSearch(query: string): string {
  const q = encodeURIComponent(query)
  return `https://www.amazon.co.uk/s?k=${q}&tag=hangazon-21`
}

/**
 * Baked catalog: hangman title + buy-box fields + affiliate URL.
 * No API — edit this file to add/change listings.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'earbuds',
    title: 'WIRELESS EARBUDS',
    listingTitle: 'Wireless Earbuds Bluetooth 5.3 with Charging Case, IPX5',
    brand: 'SoundNest',
    price: 29.99,
    listPrice: 49.99,
    rating: 4.4,
    reviews: 12843,
    prime: true,
    blurb: 'Clear calls, 32-hour case battery, pocket-size case.',
    asin: 'B0DEMOEAR1',
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
    affiliateUrl: affiliateSearch('wireless earbuds bluetooth charging case'),
  },
  {
    id: 'keyboard',
    title: 'MECHANICAL KEYBOARD',
    listingTitle: 'Mechanical Gaming Keyboard RGB, Hot-Swap Switches',
    brand: 'KeyForge',
    price: 69.99,
    listPrice: 89.99,
    rating: 4.6,
    reviews: 5521,
    prime: true,
    blurb: 'Tactile switches, aluminium top plate, USB-C.',
    asin: 'B0DEMOKEY1',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
    affiliateUrl: affiliateSearch('mechanical gaming keyboard rgb'),
  },
  {
    id: 'camera',
    title: 'INSTANT CAMERA',
    listingTitle: 'Instant Print Camera with Built-in Flash — Film Sold Separately',
    brand: 'SnapFolio',
    price: 84.99,
    listPrice: 99.99,
    rating: 4.5,
    reviews: 9012,
    prime: true,
    blurb: 'Point, shoot, peel. Classic credit-card prints.',
    asin: 'B0DEMOCAM1',
    imageUrl:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
    affiliateUrl: affiliateSearch('instant print camera'),
  },
  {
    id: 'watch',
    title: 'SMART WATCH',
    listingTitle: 'Smart Watch Fitness Tracker with Heart Rate & GPS',
    brand: 'PulseTrail',
    price: 129.0,
    listPrice: 159.0,
    rating: 4.3,
    reviews: 22014,
    prime: true,
    blurb: '7-day battery, sleep tracking, water resistant.',
    asin: 'B0DEMOWCH1',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    category: 'Electronics',
    affiliateUrl: affiliateSearch('smart watch fitness tracker gps'),
  },
  {
    id: 'skillet',
    title: 'CAST IRON SKILLET',
    listingTitle: 'Pre-Seasoned Cast Iron Skillet, 30 cm',
    brand: 'Hearth & Pan',
    price: 32.5,
    listPrice: 39.99,
    rating: 4.7,
    reviews: 18402,
    prime: true,
    blurb: 'Oven-safe, stove-safe, builds a natural non-stick.',
    asin: 'B0DEMOSKL1',
    imageUrl:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('cast iron skillet 30cm'),
  },
  {
    id: 'blender',
    title: 'PERSONAL BLENDER',
    listingTitle: 'Personal Blender with To-Go Cup, 600W',
    brand: 'BlendGo',
    price: 39.99,
    listPrice: 54.99,
    rating: 4.2,
    reviews: 6733,
    prime: true,
    blurb: 'Smoothies in 30 seconds. Dishwasher-safe cup.',
    asin: 'B0DEMOBLD1',
    imageUrl:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('personal blender to go cup'),
  },
  {
    id: 'kettle',
    title: 'ELECTRIC KETTLE',
    listingTitle: 'Stainless Steel Electric Kettle, 1.7L Rapid Boil',
    brand: 'BoilRight',
    price: 24.99,
    listPrice: 34.99,
    rating: 4.5,
    reviews: 11028,
    prime: true,
    blurb: 'Auto shut-off, boil-dry protection, cordless base.',
    asin: 'B0DEMOKTL1',
    imageUrl:
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('stainless steel electric kettle 1.7l'),
  },
  {
    id: 'lamp',
    title: 'DESK LAMP',
    listingTitle: 'LED Desk Lamp with USB Charging Port, Dimmable',
    brand: 'LumenDesk',
    price: 27.99,
    listPrice: 39.5,
    rating: 4.4,
    reviews: 8455,
    prime: true,
    blurb: '5 colour temps, eye-care mode, clamp-free base.',
    asin: 'B0DEMOLMP1',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
    affiliateUrl: affiliateSearch('led desk lamp usb dimmable'),
  },
  {
    id: 'mug',
    title: 'CERAMIC COFFEE MUG',
    listingTitle: 'Ceramic Coffee Mug 350ml, Microwave Safe',
    brand: 'Clay & Co',
    price: 12.99,
    listPrice: 16.5,
    rating: 4.6,
    reviews: 4021,
    prime: true,
    blurb: 'Thick glaze, comfortable handle, stackable.',
    asin: 'B0DEMOMUG1',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
    affiliateUrl: affiliateSearch('ceramic coffee mug 350ml'),
  },
  {
    id: 'candle',
    title: 'SCENTED CANDLE',
    listingTitle: 'Soy Scented Candle, 40-Hour Burn — Sandalwood',
    brand: 'Northwick',
    price: 18.0,
    listPrice: 24.0,
    rating: 4.5,
    reviews: 3199,
    prime: true,
    blurb: 'Clean soy wax, cotton wick, gift-ready tin.',
    asin: 'B0DEMOCND1',
    imageUrl:
      'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=1200&q=80',
    category: 'Home',
    affiliateUrl: affiliateSearch('soy scented candle sandalwood'),
  },
  {
    id: 'yogamat',
    title: 'YOGA MAT',
    listingTitle: 'Non-Slip Yoga Mat 6mm Extra Thick with Carry Strap',
    brand: 'FlexForm',
    price: 22.99,
    listPrice: 29.99,
    rating: 4.4,
    reviews: 15670,
    prime: true,
    blurb: 'Cushioned TPE, dual-sided grip, easy wipe clean.',
    asin: 'B0DEMOYGA1',
    imageUrl:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=1200&q=80',
    category: 'Fitness',
    affiliateUrl: affiliateSearch('non slip yoga mat 6mm'),
  },
  {
    id: 'dumbbells',
    title: 'HEX DUMBBELLS',
    listingTitle: 'Hex Dumbbell Pair with Rubber Coating — 2 × 5kg',
    brand: 'IronLane',
    price: 34.99,
    listPrice: 44.99,
    rating: 4.7,
    reviews: 9888,
    prime: true,
    blurb: 'Floor-safe hex heads, secure knurled handles.',
    asin: 'B0DEMODMB1',
    imageUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    category: 'Fitness',
    affiliateUrl: affiliateSearch('hex dumbbells rubber 5kg pair'),
  },
  {
    id: 'backpack',
    title: 'TRAVEL BACKPACK',
    listingTitle: 'Travel Backpack 40L Carry-On Friendly, Laptop Sleeve',
    brand: 'Packwise',
    price: 59.99,
    listPrice: 79.0,
    rating: 4.5,
    reviews: 7230,
    prime: true,
    blurb: 'Fits under seat, padded 15" sleeve, water-resistant.',
    asin: 'B0DEMOPCK1',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    category: 'Travel',
    affiliateUrl: affiliateSearch('travel backpack 40l laptop'),
  },
  {
    id: 'duffel',
    title: 'WEEKENDER BAG',
    listingTitle: 'Weekender Duffel Bag, Water-Resistant with Shoe Pocket',
    brand: 'Harbour Kit',
    price: 48.0,
    listPrice: 65.0,
    rating: 4.3,
    reviews: 2144,
    prime: true,
    blurb: 'Overnight-ready, separate shoe bay, luggage sleeve.',
    asin: 'B0DEMODFL1',
    imageUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
    category: 'Travel',
    affiliateUrl: affiliateSearch('weekender duffel bag shoe pocket'),
  },
  {
    id: 'sneakers',
    title: 'RUNNING SHOES',
    listingTitle: 'Men\'s Road Running Shoes — Lightweight Breathable Mesh',
    brand: 'StrideCo',
    price: 64.99,
    listPrice: 89.99,
    rating: 4.4,
    reviews: 19002,
    prime: true,
    blurb: 'Cushioned midsole, reflective hits, everyday miles.',
    asin: 'B0DEMOSNK1',
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
    affiliateUrl: affiliateSearch('mens road running shoes mesh'),
  },
  {
    id: 'cap',
    title: 'BASEBALL CAP',
    listingTitle: 'Classic Baseball Cap Adjustable — Washed Cotton',
    brand: 'Fieldmark',
    price: 14.99,
    listPrice: 19.99,
    rating: 4.2,
    reviews: 5601,
    prime: true,
    blurb: 'Curved brim, soft crown, one-size strap.',
    asin: 'B0DEMOCAP1',
    imageUrl:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
    affiliateUrl: affiliateSearch('classic baseball cap washed cotton'),
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
