import {
  type CategoryFilter,
  type Product,
  productsIn,
} from '../data/products'

/** Fisher–Yates shuffle (copy). */
export function shuffleProducts(list: readonly Product[]): Product[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = next[i]!
    next[i] = next[j]!
    next[j] = a
  }
  return next
}

/** Ladder order for a climb — aisle filter, then shuffle. */
export function buildLadder(filter: CategoryFilter = 'All'): Product[] {
  const pool = productsIn(filter)
  return shuffleProducts(pool.length > 0 ? pool : productsIn('All'))
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
