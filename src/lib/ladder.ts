import {
  type CategoryFilter,
  type Product,
  productsIn,
} from '../data/products'
import { sealLadder, type SealedProduct } from './vault'

/** Fisher–Yates shuffle (copy). */
export function shuffleProducts<T>(list: readonly T[]): T[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = next[i]!
    next[i] = next[j]!
    next[j] = a
  }
  return next
}

/** Ladder order for a climb — aisle filter, then shuffle, then seal. */
export function buildLadder(filter: CategoryFilter = 'All'): SealedProduct[] {
  const pool = productsIn(filter)
  const open = shuffleProducts(pool.length > 0 ? pool : productsIn('All'))
  return sealLadder(open)
}

export type LadderResult = 'cleared' | 'failed'

export type LadderHistoryEntry = {
  product: Product
  result: LadderResult
  priceScore: number
  priceGuess: string
  blankBonus: number
  blanksAtGuess: number
}

export type { SealedProduct }
