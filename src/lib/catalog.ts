import {
  type CategoryFilter,
  type Product,
  pickRandomProduct,
} from '../data/products'
import { dailyKey, pickDailyProduct } from './daily'

/** Baked Associates tag used in catalog affiliate URLs. */
export const ASSOCIATE_TAG = 'hangazon-21'

export function getAssociateTag() {
  return ASSOCIATE_TAG
}

/** Sync pick from the local catalog — no network, no PA-API. */
export function pickCatalogProduct(opts: {
  mode: 'daily' | 'random'
  category?: CategoryFilter
  excludeId?: string
}): Product {
  const category = opts.category ?? 'All'
  if (opts.mode === 'daily') return pickDailyProduct(dailyKey())
  return pickRandomProduct(category, opts.excludeId)
}
