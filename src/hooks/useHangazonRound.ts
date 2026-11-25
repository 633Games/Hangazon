import { useCallback, useMemo, useState } from 'react'
import { pickRandomProduct, type Product } from '../data/products'
import {
  isTitleSolved,
  MAX_MISSES,
  normalizeTitle,
} from '../lib/hangman'
import { priceAccuracy } from '../lib/scoring'

export type Phase = 'intro' | 'letters' | 'price' | 'reveal'

export type LetterFlight = {
  id: number
  letter: string
  hit: boolean
}

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
  const [flight, setFlight] = useState<LetterFlight | null>(null)
  const [flightBusy, setFlightBusy] = useState(false)

  const title = useMemo(() => normalizeTitle(product.title), [product.title])

  const start = useCallback(() => {
    setPhase('letters')
  }, [])

  const guessLetter = useCallback(
    (raw: string) => {
      if (phase !== 'letters' || letterOutcome !== null || flightBusy) return
      const letter = raw.toUpperCase()
      if (!/^[A-Z]$/.test(letter) || guessed.has(letter)) return

      const hit = title.includes(letter)
      setFlightBusy(true)
      setFlight({ id: Date.now(), letter, hit })
    },
    [phase, letterOutcome, flightBusy, guessed, title],
  )

  const finishFlight = useCallback(() => {
    if (!flight) return

    const next = new Set(guessed)
    next.add(flight.letter)
    setGuessed(next)

    let nextMisses = misses
    if (!flight.hit) {
      nextMisses = misses + 1
      setMisses(nextMisses)
      setShakeKey((k) => k + 1)
    }

    setFlight(null)
    setFlightBusy(false)

    const won = isTitleSolved(title, next)
    const lost = nextMisses >= MAX_MISSES
    if (won || lost) {
      setLetterOutcome(won ? 'win' : 'lose')
      window.setTimeout(() => setPhase('price'), 500)
    }
  }, [flight, guessed, misses, title])

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
    setFlight(null)
    setFlightBusy(false)
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
    flight,
    flightBusy,
    start,
    guessLetter,
    finishFlight,
    submitPrice,
    playAgain,
  }
}
