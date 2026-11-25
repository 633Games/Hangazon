import { useCallback, useMemo, useRef, useState } from 'react'
import {
  type CategoryFilter,
  type Product,
} from '../data/products'
import { pickCatalogProduct } from '../lib/catalog'
import {
  dailyCategory,
  dailyKey,
  isDailyDone,
  markDailyDone,
} from '../lib/daily'
import {
  isTitleSolved,
  isWordRevealed,
  MAX_MISSES,
  normalizeTitle,
  titleWords,
  titlesMatch,
  wordMatches,
} from '../lib/hangman'
import {
  blankSpaceBonus,
  countBlanksLeft,
  countLetterSlots,
  finalScore,
} from '../lib/scoring'

export type Phase = 'intro' | 'letters' | 'price' | 'reveal'
export type PlayMode = 'daily' | 'random'

export type LetterFlight = {
  id: number
  letter: string
  hit: boolean
  speed: number
}

/** Aggressive type-ahead multiplier — mash keys and flights fly. */
const MAX_SPEED = 24

function freshRoundState() {
  return {
    guessed: new Set<string>(),
    misses: 0,
    letterOutcome: null as 'win' | 'lose' | 'guess' | null,
    priceGuess: '',
    priceScore: null as number | null,
    flight: null as LetterFlight | null,
    flightBusy: false,
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
    pickCatalogProduct({
      mode: isDailyDone(today) ? 'random' : 'daily',
      category: 'All',
    }),
  )
  const [phase, setPhase] = useState<Phase>('intro')
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())
  const [misses, setMisses] = useState(0)
  const [letterOutcome, setLetterOutcome] = useState<
    'win' | 'lose' | 'guess' | null
  >(null)
  const [priceGuess, setPriceGuess] = useState('')
  const [priceScore, setPriceScore] = useState<number | null>(null)
  const [titleGuess, setTitleGuessState] = useState('')
  const [titleGuessWrong, setTitleGuessWrong] = useState(false)

  const setTitleGuess = useCallback((v: string) => {
    setTitleGuessState(v)
    setTitleGuessWrong(false)
  }, [])
  const [blankBonus, setBlankBonus] = useState(0)
  const [blanksAtGuess, setBlanksAtGuess] = useState(0)
  const [shakeKey, setShakeKey] = useState(0)
  const [flight, setFlight] = useState<LetterFlight | null>(null)
  const [flightBusy, setFlightBusy] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [typeSpeed, setTypeSpeed] = useState(1)

  const guessedRef = useRef(guessed)
  guessedRef.current = guessed
  const missesRef = useRef(misses)
  missesRef.current = misses
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
    // Quadratic ramp so rapid presses feel dramatically faster.
    const speed = Math.min(
      MAX_SPEED,
      Math.max(1, Math.round(1 + combo * combo * 0.55)),
    )
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
    missesRef.current = 0
    setLetterOutcome(fresh.letterOutcome)
    setPriceGuess(fresh.priceGuess)
    setPriceScore(fresh.priceScore)
    setTitleGuessState('')
    setTitleGuessWrong(false)
    setBlankBonus(0)
    setBlanksAtGuess(0)
    setFlight(fresh.flight)
    flightRef.current = null
    setFlightBusy(fresh.flightBusy)
    setShakeKey(0)
    setQueue([])
    queueRef.current = []
    setTypeSpeed(1)
    comboRef.current = 0
  }, [])

  const startDaily = useCallback(() => {
    const next = pickCatalogProduct({ mode: 'daily' })
    setCategory(next.category)
    resetBoard(next, 'daily')
    setPhase('letters')
  }, [resetBoard])

  const startRandom = useCallback(
    (filter: CategoryFilter = category) => {
      const next = pickCatalogProduct({ mode: 'random', category: filter })
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

      comboRef.current = Math.min(12, comboRef.current + 1)
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

    let nextMisses = missesRef.current
    if (!current.hit) {
      nextMisses = missesRef.current + 1
      missesRef.current = nextMisses
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
      if (won) {
        setLetterOutcome('win')
        outcomeRef.current = 'win'
        window.setTimeout(() => setPhase('price'), 420)
      } else {
        setLetterOutcome('lose')
        outcomeRef.current = 'lose'
        // Stay on letters for YOU DIED → Next continues to listing
      }
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
  }, [title, bumpSpeed, beginFlight])

  const clearFlights = useCallback(() => {
    setQueue([])
    queueRef.current = []
    setFlight(null)
    flightRef.current = null
    setFlightBusy(false)
    setTypeSpeed(1)
    comboRef.current = 0
  }, [])

  /** Correct full-title guess → blank bonus + price round. */
  const succeedTitleGuess = useCallback(() => {
    const blanks = countBlanksLeft(title, guessedRef.current)
    const total = countLetterSlots(title)
    setBlanksAtGuess(blanks)
    setBlankBonus(blankSpaceBonus(blanks, total))
    setTitleGuessWrong(false)
    clearFlights()
    setLetterOutcome('guess')
    outcomeRef.current = 'guess'
    window.setTimeout(() => setPhase('price'), 280)
  }, [title, clearFlights])

  const applyTitleMiss = useCallback(() => {
    const nextMisses = missesRef.current + 1
    missesRef.current = nextMisses
    setMisses(nextMisses)
    setShakeKey((k) => k + 1)

    if (nextMisses >= MAX_MISSES) {
      clearFlights()
      setLetterOutcome('lose')
      outcomeRef.current = 'lose'
    }
  }, [clearFlights])

  /** After YOU DIED, continue into the price listing (blood stays until next game). */
  const continueAfterDeath = useCallback(() => {
    if (outcomeRef.current !== 'lose') return
    if (phase !== 'letters') return
    setPhase('price')
  }, [phase])

  const submitTitleGuess = useCallback(() => {
    if (phase !== 'letters' || outcomeRef.current !== null) return
    if (!titleGuess.trim()) return

    if (titlesMatch(titleGuess, title)) {
      succeedTitleGuess()
      return
    }

    setTitleGuessWrong(true)
    applyTitleMiss()
  }, [phase, titleGuess, title, succeedTitleGuess, applyTitleMiss])

  /**
   * Correct word guess → reveal that word's letters on the board.
   * Returns true when the guess matched.
   */
  const submitWordGuess = useCallback(
    (wordIndex: number, guess: string): boolean => {
      if (phase !== 'letters' || outcomeRef.current !== null) return false
      if (!guess.trim()) return false

      const words = titleWords(title)
      const target = words[wordIndex]
      if (!target || isWordRevealed(target, guessedRef.current)) return false

      if (!wordMatches(guess, title, wordIndex)) {
        applyTitleMiss()
        return false
      }

      const nextGuessed = new Set(guessedRef.current)
      for (const ch of target) {
        if (/[A-Z]/.test(ch)) nextGuessed.add(ch)
      }
      setGuessed(nextGuessed)
      guessedRef.current = nextGuessed
      setTitleGuessWrong(false)

      if (isTitleSolved(title, nextGuessed)) {
        clearFlights()
        setLetterOutcome('win')
        outcomeRef.current = 'win'
        window.setTimeout(() => setPhase('price'), 420)
      }
      return true
    },
    [phase, title, applyTitleMiss, clearFlights],
  )

  const submitPrice = useCallback(() => {
    if (phase !== 'price') return
    const cleaned = priceGuess.replace(/[^0-9.]/g, '')
    const value = Number.parseFloat(cleaned)
    // Blank-space boost only for a correct early title guess
    const blanks = letterOutcome === 'guess' ? blanksAtGuess : 0
    const total = countLetterSlots(title)
    const score = finalScore({
      priceGuess: value,
      actualPrice: product.price,
      blanksLeft: blanks,
      totalLetters: total,
    })
    setBlankBonus(blankSpaceBonus(blanks, total))
    setPriceScore(score)
    setPhase('reveal')
    if (mode === 'daily') {
      markDailyDone(today)
      setDailyDone(true)
    }
  }, [
    phase,
    priceGuess,
    product.price,
    mode,
    today,
    letterOutcome,
    blanksAtGuess,
    title,
  ])

  const playAgain = useCallback(() => {
    if (mode === 'daily') {
      markDailyDone(today)
      setDailyDone(true)
      setCategory('All')
      const next = pickCatalogProduct({
        mode: 'random',
        category: 'All',
        excludeId: product.id,
      })
      resetBoard(next, 'random')
      setPhase('letters')
      return
    }
    const next = pickCatalogProduct({
      mode: 'random',
      category,
      excludeId: product.id,
    })
    resetBoard(next, 'random')
    setPhase('letters')
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
    titleGuess,
    setTitleGuess,
    titleGuessWrong,
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
    continueAfterDeath,
    submitTitleGuess,
    submitWordGuess,
    submitPrice,
    playAgain,
    blankBonus,
    blanksAtGuess,
  }
}
