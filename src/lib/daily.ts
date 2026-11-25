import {
  CATEGORIES,
  PRODUCTS,
  type Category,
  type Product,
} from '../data/products'

const STORAGE_PREFIX = 'hangazon.daily.'

/** Local calendar day key — daily is timezone-local. */
export function dailyKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Category of the day: stable hash of the date into aisle list. */
export function dailyCategory(key = dailyKey()): Category {
  return CATEGORIES[hash(`${key}:cat`) % CATEGORIES.length]!
}

/**
 * One shared listing for everyone on this local day:
 * pick today's aisle, then one SKU in that aisle.
 */
export function pickDailyProduct(key = dailyKey()): Product {
  const cat = dailyCategory(key)
  const pool = PRODUCTS.filter((p) => p.category === cat)
  const list = pool.length > 0 ? pool : PRODUCTS
  return list[hash(`${key}:sku`) % list.length]!
}

export function isDailyDone(key = dailyKey()): boolean {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key) === '1'
  } catch {
    return false
  }
}

export function markDailyDone(key = dailyKey()): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, '1')
  } catch {
    // ignore quota / private mode
  }
}
