/**
 * Amazon Product Advertising API (PA-API 5.0) — server only.
 * Returns null when credentials are missing or the call fails.
 */
import amazonPaapi from 'amazon-paapi'

const CATEGORIES = [
  'Electronics',
  'Kitchen',
  'Home',
  'Fitness',
  'Travel',
  'Fashion',
]

const SEARCH = {
  Electronics: {
    index: 'Electronics',
    keywords: [
      'wireless earbuds',
      'mechanical keyboard',
      'usb webcam',
      'bluetooth speaker',
      'smart watch',
    ],
  },
  Kitchen: {
    index: 'Kitchen',
    keywords: [
      'cast iron skillet',
      'electric kettle',
      'personal blender',
      'chef knife',
    ],
  },
  Home: {
    index: 'HomeAndKitchen',
    keywords: ['desk lamp', 'scented candle', 'ceramic mug', 'throw blanket'],
  },
  Fitness: {
    index: 'SportsAndOutdoors',
    keywords: ['yoga mat', 'dumbbells', 'resistance bands', 'jump rope'],
  },
  Travel: {
    index: 'Luggage',
    keywords: [
      'travel backpack',
      'weekender bag',
      'packing cubes',
      'neck pillow',
    ],
  },
  Fashion: {
    index: 'Fashion',
    keywords: ['running shoes', 'baseball cap', 'leather belt', 'wool socks'],
  },
}

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function credentialsReady() {
  return Boolean(
    process.env.AMAZON_PAAPI_ACCESS_KEY &&
      process.env.AMAZON_PAAPI_SECRET_KEY &&
      process.env.AMAZON_ASSOCIATE_TAG,
  )
}

export function associateTag() {
  return process.env.AMAZON_ASSOCIATE_TAG || 'hangazon-20'
}

export function toHangmanTitle(amazonTitle) {
  const words = String(amazonTitle || '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && w.length <= 14)
    .slice(0, 3)
  return words.join(' ') || 'AMAZON FIND'
}

function mapItem(item, category) {
  const asin = item?.ASIN
  const titleRaw = item?.ItemInfo?.Title?.DisplayValue
  const image =
    item?.Images?.Primary?.Large?.URL ||
    item?.Images?.Primary?.Medium?.URL ||
    item?.Images?.Primary?.Small?.URL
  const priceAmount =
    item?.OffersV2?.Listings?.[0]?.Price?.Money?.Amount ??
    item?.Offers?.Listings?.[0]?.Price?.Amount
  const price =
    typeof priceAmount === 'number'
      ? priceAmount
      : Number.parseFloat(String(priceAmount ?? ''))

  if (!asin || !titleRaw || !image || !Number.isFinite(price) || price <= 0) {
    return null
  }

  const title = toHangmanTitle(titleRaw)
  if (title.replace(/\s/g, '').length < 4) return null

  return {
    id: asin,
    title,
    price,
    asin,
    imageUrl: image,
    category,
    detailUrl: item?.DetailPageURL || null,
  }
}

async function searchCategory(category, keyword, itemCount = 10) {
  const conf = SEARCH[category] || SEARCH.Electronics
  const commonParameters = {
    AccessKey: process.env.AMAZON_PAAPI_ACCESS_KEY,
    SecretKey: process.env.AMAZON_PAAPI_SECRET_KEY,
    PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
    PartnerType: 'Associates',
    Marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.com',
  }

  const data = await amazonPaapi.SearchItemsV2(commonParameters, {
    Keywords: keyword,
    SearchIndex: conf.index,
    ItemCount: itemCount,
    Resources: [
      'Images.Primary.Large',
      'Images.Primary.Medium',
      'ItemInfo.Title',
      'OffersV2.Listings.Price',
    ],
  })

  const items = data?.SearchResult?.Items || []
  return items
    .map((item) => mapItem(item, category))
    .filter(Boolean)
}

export async function fetchLiveProduct({
  mode = 'random',
  category = 'All',
  dayKey,
  excludeId,
} = {}) {
  if (!credentialsReady()) return null

  try {
    let aisle = category
    if (aisle === 'All' || !SEARCH[aisle]) {
      if (mode === 'daily' && dayKey) {
        aisle = CATEGORIES[hash(`${dayKey}:cat`) % CATEGORIES.length]
      } else {
        aisle = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      }
    }

    const conf = SEARCH[aisle]
    const keyword =
      mode === 'daily' && dayKey
        ? conf.keywords[hash(`${dayKey}:kw`) % conf.keywords.length]
        : conf.keywords[Math.floor(Math.random() * conf.keywords.length)]

    const products = await searchCategory(aisle, keyword, 10)
    const pool = excludeId
      ? products.filter((p) => p.id !== excludeId)
      : products
    if (pool.length === 0) return null

    if (mode === 'daily' && dayKey) {
      return pool[hash(`${dayKey}:sku`) % pool.length]
    }
    return pool[Math.floor(Math.random() * pool.length)]
  } catch (err) {
    console.error('[paapi]', err?.message || err)
    return null
  }
}
