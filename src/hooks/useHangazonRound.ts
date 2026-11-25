import { useCallback, useMemo, useState } from 'react'
import {
  pickRandomProduct,
  type CategoryFilter,
  type Product,
} from '../data/products'
import {
  dailyCategory,
  dailyKey,
  isDailyDone,
  markDailyDone,
  pickDailyProduct,
} from '../lib/daily'
import {
  isTitleSolved,
  MAX_MISSES,
  normalizeTitle,
} from '../lib/hangman'
import { priceAccuracy } from '../lib/scoring'

export type Phase = 'intro' | 'letters' | 'price' | 'reveal'
export type PlayMode = 'daily' | 'random'

export type LetterFlight = {
  id: number
  letter: string
  hit: boolean
}

function freshRoundState() {
  return {
    guessed: new Set<string>(),
    misses: 0,
    letterOutcome: null as 'win' | 'lose' | null,
    priceGuess: '',
    priceScore: null as number | null,
    flight: null as LetterFlight | null,
    flightBusy: false,
    shakeKey: 0,
  }
}

export function useHangazonRound() {
  const today = dailyKey()
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [mode, setMode] = useState<PlayMode>(() =>
    isDailyDone(today) ? 'random' : 'daily',
  )
  const [dailyDone, setDailyDone] = useState(() => isDailyDone(today))
  const [product, setProduct] = useState<Product>(() =>
    isDailyDone(today) ? pickRandomProduct('All') : pickDailyProduct(today),
  )
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
  const todayCategory = useMemo(() => dailyCategory(today), [today])

  const resetBoard = useCallback((next: Product, nextMode: PlayMode) => {
    const fresh = freshRoundState()
    setProduct(next)
    setMode(nextMode)
    setPhase('intro')
    setGuessed(fresh.guessed)
    setMisses(fresh.misses)
    setLetterOutcome(fresh.letterOutcome)
    setPriceGuess(fresh.priceGuess)
    setPriceScore(fresh.priceScore)
    setFlight(fresh.flight)
    setFlightBusy(fresh.flightBusy)
    setShakeKey(0)
  }, [])

  const start = useCallback(() => {
    setPhase('letters')
  }, [])

  const startDaily = useCallback(() => {
    const next = pickDailyProduct(today)
    setCategory(dailyCategory(today))
    resetBoard(next, 'daily')
    setPhase('letters')
  }, [today, resetBoard])

  const startRandom = useCallback(
    (filter: CategoryFilter = category) => {
      const next = pickRandomProduct(filter)
      setCategory(filter)
      resetBoard(next, 'random')
      setPhase('letters')
    },
    [category, resetBoard],
  )

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
    if (mode === 'daily') {
      markDailyDone(today)
      setDailyDone(true)
    }
  }, [phase, priceGuess, product.price, mode, today])

  /** After a round: daily → random; random → another random. */
  const playAgain = useCallback(() => {
    if (mode === 'daily') {
      markDailyDone(today)
      setDailyDone(true)
      setCategory('All')
      const next = pickRandomProduct('All', product.id)
      resetBoard(next, 'random')
      return
    }
    const next = pickRandomProduct(category, product.id)
    resetBoard(next, 'random')
  }, [mode, today, category, product.id, resetBoard])

  return {
    product,
    title,
    phase,
    mode,
    category,
    setCategory,
    todayCategory,
    dailyDone,
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
    startDaily,
    startRandom,
    guessLetter,
    finishFlight,
    submitPrice,
    playAgain,
  }
}
