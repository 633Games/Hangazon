import { useCallback, useMemo, useState } from 'react'
import { pickRandomProduct, type Product } from '../data/products'
import {
  isTitleSolved,
  MAX_MISSES,
  normalizeTitle,
} from '../lib/hangman'
import { priceAccuracy } from '../lib/scoring'

export type Phase = 'intro' | 'letters' | 'price' | 'reveal'

export function useHangazonRound() {
  const [product, setProduct] = useState<Product>(() => pickRandomProduct())
  const [phase, setPhase] = useState<Phase>('intro')
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())
  const [misses, setMisses] = useState(0)
  const [letterOutcome, setLetterOutcome] = useState<'win' | 'lose' | null>(
    null,
  )
  const [priceGuess, setPriceGuess] = useState('')
  const [priceScore, setPriceScore] = useState<number | null>(null)
  const [shakeKey, setShakeKey] = useState(0)

  const title = useMemo(() => normalizeTitle(product.title), [product.title])

  const start = useCallback(() => {
    setPhase('letters')
  }, [])

  const guessLetter = useCallback(
    (raw: string) => {
      if (phase !== 'letters') return
      const letter = raw.toUpperCase()
      if (!/^[A-Z]$/.test(letter) || guessed.has(letter)) return

      const next = new Set(guessed)
      next.add(letter)
      setGuessed(next)

      const hit = title.includes(letter)
      let nextMisses = misses
      if (!hit) {
        nextMisses = misses + 1
        setMisses(nextMisses)
        setShakeKey((k) => k + 1)
      }

      const won = isTitleSolved(title, next)
      const lost = nextMisses >= MAX_MISSES
      if (won || lost) {
        setLetterOutcome(won ? 'win' : 'lose')
        window.setTimeout(() => setPhase('price'), 700)
      }
    },
    [phase, guessed, title, misses],
  )

  const submitPrice = useCallback(() => {
    if (phase !== 'price') return
    const cleaned = priceGuess.replace(/[^0-9.]/g, '')
    const value = Number.parseFloat(cleaned)
    const score = priceAccuracy(value, product.price)
    setPriceScore(score)
    setPhase('reveal')
  }, [phase, priceGuess, product.price])

  const playAgain = useCallback(() => {
    setProduct(pickRandomProduct(product.id))
    setPhase('intro')
    setGuessed(new Set())
    setMisses(0)
    setLetterOutcome(null)
    setPriceGuess('')
    setPriceScore(null)
  }, [product.id])

  return {
    product,
    title,
    phase,
    guessed,
    misses,
    letterOutcome,
    priceGuess,
    setPriceGuess,
    priceScore,
    shakeKey,
    start,
    guessLetter,
    submitPrice,
    playAgain,
  }
}
