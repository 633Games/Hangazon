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
  /** Amazon listing title — hangman puzzle + buy box */
  title: string
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
 * Baked catalog: listing title is the hangman puzzle; plus buy-box fields + affiliate URL.
 * No API — edit this file to add/change listings.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'earbuds',
    title: 'Wireless Earbuds Bluetooth 5.3 with Charging Case, IPX5',
    brand: 'SoundNest',
    price: 29.99,
    listPrice: 49.99,
    rating: 4.4,
    reviews: 12843,
    prime: true,
    blurb: 'Clear calls, 32-hour case battery, pocket-size case.',
    asin: 'B0DEMOEAR1',
    imageUrl: `${import.meta.env.BASE_URL}products/earbuds.jpg`,
    category: 'Electronics',
    affiliateUrl: affiliateSearch('wireless earbuds bluetooth charging case'),
  },
  {
    id: 'keyboard',
    title: 'Mechanical Gaming Keyboard RGB, Hot-Swap Switches',
    brand: 'KeyForge',
    price: 69.99,
    listPrice: 89.99,
    rating: 4.6,
    reviews: 5521,
    prime: true,
    blurb: 'Tactile switches, aluminium top plate, USB-C.',
    asin: 'B0DEMOKEY1',
    imageUrl: `${import.meta.env.BASE_URL}products/keyboard.jpg`,
    category: 'Electronics',
    affiliateUrl: affiliateSearch('mechanical gaming keyboard rgb'),
  },
  {
    id: 'camera',
    title: 'Instant Print Camera with Built-in Flash — Film Sold Separately',
    brand: 'SnapFolio',
    price: 84.99,
    listPrice: 99.99,
    rating: 4.5,
    reviews: 9012,
    prime: true,
    blurb: 'Point, shoot, peel. Classic credit-card prints.',
    asin: 'B0DEMOCAM1',
    imageUrl: `${import.meta.env.BASE_URL}products/camera.jpg`,
    category: 'Electronics',
    affiliateUrl: affiliateSearch('instant print camera'),
  },
  {
    id: 'watch',
    title: 'Smart Watch Fitness Tracker with Heart Rate & GPS',
    brand: 'PulseTrail',
    price: 129.0,
    listPrice: 159.0,
    rating: 4.3,
    reviews: 22014,
    prime: true,
    blurb: '7-day battery, sleep tracking, water resistant.',
    asin: 'B0DEMOWCH1',
    imageUrl: `${import.meta.env.BASE_URL}products/watch.jpg`,
    category: 'Electronics',
    affiliateUrl: affiliateSearch('smart watch fitness tracker gps'),
  },
  {
    id: 'skillet',
    title: 'Pre-Seasoned Cast Iron Skillet, 30 cm',
    brand: 'Hearth & Pan',
    price: 32.5,
    listPrice: 39.99,
    rating: 4.7,
    reviews: 18402,
    prime: true,
    blurb: 'Oven-safe, stove-safe, builds a natural non-stick.',
    asin: 'B0DEMOSKL1',
    imageUrl: `${import.meta.env.BASE_URL}products/skillet.jpg`,
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('cast iron skillet 30cm'),
  },
  {
    id: 'blender',
    title: 'Personal Blender with To-Go Cup, 600W',
    brand: 'BlendGo',
    price: 39.99,
    listPrice: 54.99,
    rating: 4.2,
    reviews: 6733,
    prime: true,
    blurb: 'Smoothies in 30 seconds. Dishwasher-safe cup.',
    asin: 'B0DEMOBLD1',
    imageUrl: `${import.meta.env.BASE_URL}products/blender.jpg`,
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('personal blender to go cup'),
  },
  {
    id: 'kettle',
    title: 'Stainless Steel Electric Kettle, 1.7L Rapid Boil',
    brand: 'BoilRight',
    price: 24.99,
    listPrice: 34.99,
    rating: 4.5,
    reviews: 11028,
    prime: true,
    blurb: 'Auto shut-off, boil-dry protection, cordless base.',
    asin: 'B0DEMOKTL1',
    imageUrl: `${import.meta.env.BASE_URL}products/kettle.jpg`,
    category: 'Kitchen',
    affiliateUrl: affiliateSearch('stainless steel electric kettle 1.7l'),
  },
  {
    id: 'lamp',
    title: 'LED Desk Lamp with USB Charging Port, Dimmable',
    brand: 'LumenDesk',
    price: 27.99,
    listPrice: 39.5,
    rating: 4.4,
    reviews: 8455,
    prime: true,
    blurb: '5 colour temps, eye-care mode, clamp-free base.',
    asin: 'B0DEMOLMP1',
    imageUrl: `${import.meta.env.BASE_URL}products/lamp.jpg`,
    category: 'Home',
    affiliateUrl: affiliateSearch('led desk lamp usb dimmable'),
  },
  {
    id: 'mug',
    title: 'Ceramic Coffee Mug 350ml, Microwave Safe',
    brand: 'Clay & Co',
    price: 12.99,
    listPrice: 16.5,
    rating: 4.6,
    reviews: 4021,
    prime: true,
    blurb: 'Thick glaze, comfortable handle, stackable.',
    asin: 'B0DEMOMUG1',
    imageUrl: `${import.meta.env.BASE_URL}products/mug.jpg`,
    category: 'Home',
    affiliateUrl: affiliateSearch('ceramic coffee mug 350ml'),
  },
  {
    id: 'candle',
    title: 'Soy Scented Candle, 40-Hour Burn — Sandalwood',
    brand: 'Northwick',
    price: 18.0,
    listPrice: 24.0,
    rating: 4.5,
    reviews: 3199,
    prime: true,
    blurb: 'Clean soy wax, cotton wick, gift-ready tin.',
    asin: 'B0DEMOCND1',
    imageUrl: `${import.meta.env.BASE_URL}products/candle.jpg`,
    category: 'Home',
    affiliateUrl: affiliateSearch('soy scented candle sandalwood'),
  },
  {
    id: 'yogamat',
    title: 'Non-Slip Yoga Mat 6mm Extra Thick with Carry Strap',
    brand: 'FlexForm',
    price: 22.99,
    listPrice: 29.99,
    rating: 4.4,
    reviews: 15670,
    prime: true,
    blurb: 'Cushioned TPE, dual-sided grip, easy wipe clean.',
    asin: 'B0DEMOYGA1',
    imageUrl: `${import.meta.env.BASE_URL}products/yogamat.jpg`,
    category: 'Fitness',
    affiliateUrl: affiliateSearch('non slip yoga mat 6mm'),
  },
  {
    id: 'dumbbells',
    title: 'Hex Dumbbell Pair with Rubber Coating — 2 × 5kg',
    brand: 'IronLane',
    price: 34.99,
    listPrice: 44.99,
    rating: 4.7,
    reviews: 9888,
    prime: true,
    blurb: 'Floor-safe hex heads, secure knurled handles.',
    asin: 'B0DEMODMB1',
    imageUrl: `${import.meta.env.BASE_URL}products/dumbbells.jpg`,
    category: 'Fitness',
    affiliateUrl: affiliateSearch('hex dumbbells rubber 5kg pair'),
  },
  {
    id: 'backpack',
    title: 'Travel Backpack 40L Carry-On Friendly, Laptop Sleeve',
    brand: 'Packwise',
    price: 59.99,
    listPrice: 79.0,
    rating: 4.5,
    reviews: 7230,
    prime: true,
    blurb: 'Fits under seat, padded 15" sleeve, water-resistant.',
    asin: 'B0DEMOPCK1',
    imageUrl: `${import.meta.env.BASE_URL}products/backpack.jpg`,
    category: 'Travel',
    affiliateUrl: affiliateSearch('travel backpack 40l laptop'),
  },
  {
    id: 'duffel',
    title: 'Weekender Duffel Bag, Water-Resistant with Shoe Pocket',
    brand: 'Harbour Kit',
    price: 48.0,
    listPrice: 65.0,
    rating: 4.3,
    reviews: 2144,
    prime: true,
    blurb: 'Overnight-ready, separate shoe bay, luggage sleeve.',
    asin: 'B0DEMODFL1',
    imageUrl: `${import.meta.env.BASE_URL}products/duffel.jpg`,
    category: 'Travel',
    affiliateUrl: affiliateSearch('weekender duffel bag shoe pocket'),
  },
  {
    id: 'sneakers',
    title: 'Men\'s Road Running Shoes — Lightweight Breathable Mesh',
    brand: 'StrideCo',
    price: 64.99,
    listPrice: 89.99,
    rating: 4.4,
    reviews: 19002,
    prime: true,
    blurb: 'Cushioned midsole, reflective hits, everyday miles.',
    asin: 'B0DEMOSNK1',
    imageUrl: `${import.meta.env.BASE_URL}products/sneakers.jpg`,
    category: 'Fashion',
    affiliateUrl: affiliateSearch('mens road running shoes mesh'),
  },
  {
    id: 'cap',
    title: 'Classic Baseball Cap Adjustable — Washed Cotton',
    brand: 'Fieldmark',
    price: 14.99,
    listPrice: 19.99,
    rating: 4.2,
    reviews: 5601,
    prime: true,
    blurb: 'Curved brim, soft crown, one-size strap.',
    asin: 'B0DEMOCAP1',
    imageUrl: `${import.meta.env.BASE_URL}products/cap.jpg`,
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
