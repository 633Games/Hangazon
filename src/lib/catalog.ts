import {
  type CategoryFilter,
  type Product,
  pickRandomProduct as sampleRandom,
} from '../data/products'
import { dailyKey, pickDailyProduct as sampleDaily } from './daily'

export type CatalogSource = 'amazon' | 'sample'

export type CatalogResult = {
  product: Product
  source: CatalogSource
  associateTag: string
}

let cachedTag = 'hangazon-20'
let live = false

export function getAssociateTag() {
  return cachedTag
}

export function isLiveCatalog() {
  return live
}

export async function refreshCatalogStatus(): Promise<void> {
  try {
    const res = await fetch('/api/status')
    if (!res.ok) return
    const data = (await res.json()) as {
      live?: boolean
      associateTag?: string
    }
    live = Boolean(data.live)
    if (data.associateTag) cachedTag = data.associateTag
  } catch {
    live = false
  }
}

export async function fetchCatalogProduct(opts: {
  mode: 'daily' | 'random'
  category?: CategoryFilter
  excludeId?: string
}): Promise<CatalogResult> {
  const category = opts.category ?? 'All'
  const day = dailyKey()

  try {
    const params = new URLSearchParams({
      mode: opts.mode,
      category,
      day,
    })
    if (opts.excludeId) params.set('exclude', opts.excludeId)

    const res = await fetch(`/api/product?${params}`)
    if (res.status === 200) {
      const data = (await res.json()) as {
        product: Product
        associateTag?: string
      }
      live = true
      if (data.associateTag) cachedTag = data.associateTag
      return {
        product: data.product,
        source: 'amazon',
        associateTag: cachedTag,
      }
    }
  } catch {
    // fall through to sample
  }

  live = false
  const product =
    opts.mode === 'daily'
      ? sampleDaily(day)
      : sampleRandom(category, opts.excludeId)

  return {
    product,
    source: 'sample',
    associateTag: cachedTag,
  }
}
