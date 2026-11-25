import { useCallback, useMemo, useRef, useState } from 'react'
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
  /** Fast-type multiplier: 2 keys → 2×, 3 → 3×, … */
  speed: number
}

const MAX_SPEED = 8

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
  const [queue, setQueue] = useState<string[]>([])
  const [typeSpeed, setTypeSpeed] = useState(1)

  const guessedRef = useRef(guessed)
  guessedRef.current = guessed
  const queueRef = useRef(queue)
  queueRef.current = queue
  const flightRef = useRef(flight)
  flightRef.current = flight
  const comboRef = useRef(0)
  const outcomeRef = useRef(letterOutcome)
  outcomeRef.current = letterOutcome

  const title = useMemo(() => normalizeTitle(product.title), [product.title])
  const todayCategory = useMemo(() => dailyCategory(today), [today])

  const bumpSpeed = useCallback((combo: number) => {
    const speed = Math.min(MAX_SPEED, Math.max(1, combo))
    setTypeSpeed(speed)
    setFlight((f) => (f ? { ...f, speed } : f))
    return speed
  }, [])

  const beginFlight = useCallback(
    (letter: string, speed: number) => {
      const hit = title.includes(letter)
      setFlightBusy(true)
      setFlight({
        id: Date.now() + Math.random(),
        letter,
        hit,
        speed,
      })
    },
    [title],
  )

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
    setQueue([])
    setTypeSpeed(1)
    comboRef.current = 0
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
      if (phase !== 'letters' || outcomeRef.current !== null) return
      const letter = raw.toUpperCase()
      if (!/^[A-Z]$/.test(letter)) return
      if (guessedRef.current.has(letter)) return
      if (flightRef.current?.letter === letter) return
      if (queueRef.current.includes(letter)) return

      comboRef.current = Math.min(MAX_SPEED, comboRef.current + 1)
      const speed = bumpSpeed(comboRef.current)

      if (flightRef.current) {
        setQueue((q) => [...q, letter])
        return
      }

      beginFlight(letter, speed)
    },
    [phase, bumpSpeed, beginFlight],
  )

  const finishFlight = useCallback(() => {
    const current = flightRef.current
    if (!current) return

    const nextGuessed = new Set(guessedRef.current)
    nextGuessed.add(current.letter)
    setGuessed(nextGuessed)
    guessedRef.current = nextGuessed

    let nextMisses = misses
    if (!current.hit) {
      nextMisses = misses + 1
      setMisses(nextMisses)
      setShakeKey((k) => k + 1)
    }

    comboRef.current = Math.max(0, comboRef.current - 1)

    const won = isTitleSolved(title, nextGuessed)
    const lost = nextMisses >= MAX_MISSES
    if (won || lost) {
      setQueue([])
      queueRef.current = []
      setFlight(null)
      flightRef.current = null
      setFlightBusy(false)
      setTypeSpeed(1)
      comboRef.current = 0
      setLetterOutcome(won ? 'win' : 'lose')
      window.setTimeout(() => setPhase('price'), 420)
      return
    }

    const pending = queueRef.current
    if (pending.length > 0) {
      const [nextLetter, ...rest] = pending
      setQueue(rest)
      queueRef.current = rest
      const speed = bumpSpeed(Math.max(1, comboRef.current))
      beginFlight(nextLetter!, speed)
      return
    }

    setFlight(null)
    flightRef.current = null
    setFlightBusy(false)
    setTypeSpeed(1)
    comboRef.current = 0
  }, [misses, title, bumpSpeed, beginFlight])

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

  const pendingLetters = useMemo(() => {
    const set = new Set(queue)
    if (flight?.letter) set.add(flight.letter)
    return set
  }, [queue, flight?.letter])

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
    queue,
    typeSpeed,
    pendingLetters,
    startDaily,
    startRandom,
    guessLetter,
    finishFlight,
    submitPrice,
    playAgain,
  }
}
