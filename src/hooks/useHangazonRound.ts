import { useCallback, useMemo, useRef, useState } from 'react'
import { type CategoryFilter } from '../data/products'
import {
  buildLadder,
  type LadderHistoryEntry,
  type SealedProduct,
} from '../lib/ladder'
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
import { openProduct } from '../lib/vault'

export type Phase = 'intro' | 'letters' | 'price' | 'reveal'

export type LetterFlight = {
  id: number
  letter: string
  hit: boolean
  speed: number
}

/** Aggressive type-ahead multiplier — mash keys and flights fly. */
const MAX_SPEED = 24

function freshBoard() {
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

const LOCKED_PREVIEW = 2

function openActive(ladder: SealedProduct[], index: number) {
  const sealed = ladder[index] ?? ladder[0]!
  return openProduct(sealed)
}

export function useHangazonRound() {
  const [category, setCategory] = useState<CategoryFilter>('All')
  /** Sealed ladder — future rungs stay opaque in client state. */
  const [ladder, setLadder] = useState<SealedProduct[]>(() => buildLadder('All'))
  const [activeIndex, setActiveIndex] = useState(0)
  const [history, setHistory] = useState<LadderHistoryEntry[]>([])
  const [clears, setClears] = useState(0)
  const [bestClears, setBestClears] = useState(0)
  const [scrollToken, setScrollToken] = useState(0)

  const product = useMemo(
    () => openActive(ladder, activeIndex),
    [ladder, activeIndex],
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
  const clearsRef = useRef(clears)
  clearsRef.current = clears
  const bestRef = useRef(bestClears)
  bestRef.current = bestClears
  const unlockGenRef = useRef(0)
  const ladderRef = useRef(ladder)
  ladderRef.current = ladder
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex
  const categoryRef = useRef(category)
  categoryRef.current = category

  const title = useMemo(() => normalizeTitle(product.title), [product.title])
  const titleLetters = useMemo(() => {
    const set = new Set<string>()
    for (const ch of title) {
      if (/[A-Z]/.test(ch)) set.add(ch)
    }
    return set
  }, [title])
  /** Count only — never expose sealed product payloads to the UI tree. */
  const lockedAheadCount = useMemo(() => {
    const remaining = Math.max(0, ladder.length - activeIndex - 1)
    return Math.min(LOCKED_PREVIEW, remaining)
  }, [ladder.length, activeIndex])

  const bumpSpeed = useCallback((combo: number) => {
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

  const resetActiveBoard = useCallback(() => {
    const fresh = freshBoard()
    setGuessed(fresh.guessed)
    setMisses(fresh.misses)
    missesRef.current = 0
    setLetterOutcome(fresh.letterOutcome)
    outcomeRef.current = null
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

  const startClimb = useCallback(
    (filter: CategoryFilter = category) => {
      const nextLadder = buildLadder(filter)
      setCategory(filter)
      setLadder(nextLadder)
      setActiveIndex(0)
      setHistory([])
      setClears(0)
      clearsRef.current = 0
      resetActiveBoard()
      setPhase('letters')
      setScrollToken((t) => t + 1)
    },
    [category, resetActiveBoard],
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

  /**
   * Roguelike: YOU DIED ends the whole climb.
   * Clears reset; back to intro — must Start climb again from listing 1.
   */
  const endClimbAfterDeath = useCallback(() => {
    if (outcomeRef.current !== 'lose') return
    unlockGenRef.current += 1
    clearsRef.current = 0
    setClears(0)
    setHistory([])
    setActiveIndex(0)
    setLadder(buildLadder(categoryRef.current))
    resetActiveBoard()
    setPhase('intro')
  }, [resetActiveBoard])

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

  const unlockNext = useCallback(
    (entry: LadderHistoryEntry, expectedGen: number) => {
      if (unlockGenRef.current !== expectedGen) return
      unlockGenRef.current += 1

      // Only clears unlock the next rung — a fail ends the climb via endClimbAfterDeath.
      if (entry.result !== 'cleared') return

      setHistory((h) => [...h, entry])

      const nextClears = clearsRef.current + 1
      clearsRef.current = nextClears
      setClears(nextClears)
      if (nextClears > bestRef.current) {
        bestRef.current = nextClears
        setBestClears(nextClears)
      }

      const idx = activeIndexRef.current
      const currentLadder = ladderRef.current
      const nextIdx = idx + 1
      if (nextIdx < currentLadder.length) {
        setActiveIndex(nextIdx)
      } else {
        // Loop: fresh shuffle of the same aisle, keep climbing
        const nextLadder = buildLadder(categoryRef.current)
        setLadder(nextLadder)
        setActiveIndex(0)
      }
      resetActiveBoard()
      setPhase('letters')
      setScrollToken((t) => t + 1)
    },
    [resetActiveBoard],
  )

  const submitPrice = useCallback(() => {
    if (phase !== 'price') return
    const cleaned = priceGuess.replace(/[^0-9.]/g, '')
    const value = Number.parseFloat(cleaned)
    const blanks = letterOutcome === 'guess' ? blanksAtGuess : 0
    const total = countLetterSlots(title)
    const score = finalScore({
      priceGuess: value,
      actualPrice: product.price,
      blanksLeft: blanks,
      totalLetters: total,
    })
    const bonus = blankSpaceBonus(blanks, total)
    setBlankBonus(bonus)
    setPriceScore(score)
    setPhase('reveal')

    const gen = unlockGenRef.current

    // Brief beat on the score, then unlock the next rung + scroll
    window.setTimeout(() => {
      unlockNext(
        {
          product,
          result: 'cleared',
          priceScore: score,
          priceGuess,
          blankBonus: bonus,
          blanksAtGuess: blanks,
        },
        gen,
      )
    }, 1100)
  }, [
    phase,
    priceGuess,
    product,
    letterOutcome,
    blanksAtGuess,
    title,
    unlockNext,
  ])

  /** Manual advance from reveal if auto-timer hasn't fired yet. */
  const advanceLadder = useCallback(() => {
    if (phase !== 'reveal' || priceScore === null) return
    unlockNext(
      {
        product,
        result: 'cleared',
        priceScore,
        priceGuess,
        blankBonus,
        blanksAtGuess,
      },
      unlockGenRef.current,
    )
  }, [
    phase,
    priceScore,
    product,
    priceGuess,
    blankBonus,
    blanksAtGuess,
    unlockNext,
  ])

  const pendingLetters = useMemo(() => {
    const set = new Set(queue)
    if (flight?.letter) set.add(flight.letter)
    return set
  }, [queue, flight?.letter])

  return {
    product,
    title,
    titleLetters,
    phase,
    category,
    setCategory,
    activeIndex,
    history,
    lockedAheadCount,
    clears,
    bestClears,
    scrollToken,
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
    startClimb,
    guessLetter,
    finishFlight,
    endClimbAfterDeath,
    submitTitleGuess,
    submitWordGuess,
    submitPrice,
    advanceLadder,
    blankBonus,
    blanksAtGuess,
  }
}
