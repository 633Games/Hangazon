import { useEffect, useMemo, useRef, useState } from 'react'
import { isLetterRevealed, isWordRevealed, titleWords } from '../lib/hangman'
import type { LetterFlight } from '../hooks/useHangazonRound'

type Props = {
  title: string
  guessed: ReadonlySet<string>
  forceReveal?: boolean
  flight: LetterFlight | null
  onFlightDone: () => void
  /** When true, blank title words are hoverable/clickable guess targets. */
  interactive?: boolean
  /** Returns true when the word guess was correct. */
  onSubmitWord?: (wordIndex: number, guess: string) => boolean
}

const STEP_MS = 48
const LAND_MS = 90
const WRONG_FLASH_MS = 480
const MISS_FALL_MS = 920

type MissDrop = {
  id: number
  letter: string
  drift: number
  spin: number
  duration: number
  left: number
}

export function LetterBoard({
  title,
  guessed,
  forceReveal,
  flight,
  onFlightDone,
  interactive = false,
  onSubmitWord,
}: Props) {
  const slots = useMemo(() => {
    const out: { ch: string; flat: number }[] = []
    let flat = 0
    for (const word of title.split(' ')) {
      for (const ch of word) {
        out.push({ ch, flat })
        flat += 1
      }
    }
    return out
  }, [title])

  const words = useMemo(() => titleWords(title), [title])
  const displayWords = useMemo(() => title.split(' ').filter(Boolean), [title])

  const doneRef = useRef(onFlightDone)
  doneRef.current = onFlightDone
  const speedRef = useRef(1)
  speedRef.current = Math.max(1, flight?.speed ?? 1)

  const [cursor, setCursor] = useState(-1)
  const [landed, setLanded] = useState<Set<number>>(() => new Set())
  const [flying, setFlying] = useState(false)
  const [missDrops, setMissDrops] = useState<MissDrop[]>([])
  const flightId = flight?.id ?? null

  const [activeWord, setActiveWord] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [wrongFlash, setWrongFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const popRef = useRef<HTMLFormElement>(null)
  const flashTimer = useRef<number | null>(null)

  const closePop = () => {
    if (flashTimer.current !== null) {
      window.clearTimeout(flashTimer.current)
      flashTimer.current = null
    }
    setActiveWord(null)
    setDraft('')
    setWrongFlash(false)
  }

  useEffect(() => {
    if (!interactive) closePop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, title])

  useEffect(() => {
    return () => {
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current)
    }
  }, [])

  useEffect(() => {
    if (activeWord === null || wrongFlash) return
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }, [activeWord, wrongFlash])

  useEffect(() => {
    if (activeWord === null) return

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target
      if (!(t instanceof Node)) return
      if (popRef.current?.contains(t)) return
      const wrap = (t as Element).closest?.('.listing-word-wrap')
      if (wrap?.classList.contains('is-active')) return
      closePop()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePop()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [activeWord])

  useEffect(() => {
    if (!flight) {
      setCursor(-1)
      setLanded(new Set())
      setFlying(false)
      return
    }

    let cancelled = false
    const speed = Math.max(1, flight.speed)
    speedRef.current = speed

    const finish = () => {
      if (cancelled) return
      setFlying(false)
      setCursor(-1)
      doneRef.current()
    }

    // Miss: letter tumbles off-screen; acknowledge early so queues keep flying.
    if (!flight.hit) {
      const duration = Math.max(420, MISS_FALL_MS / Math.pow(speed, 0.55))
      const ack = Math.max(70, 260 / Math.pow(speed, 0.9))
      const drop: MissDrop = {
        id: flight.id,
        letter: flight.letter,
        drift: (Math.random() * 2 - 1) * 42,
        spin: (Math.random() * 2 - 1) * 520,
        duration,
        left: 28 + Math.random() * 44,
      }
      setMissDrops((prev) => [...prev, drop])
      setFlying(false)
      setCursor(-1)
      setLanded(new Set())

      const ackTimer = window.setTimeout(finish, ack)
      const clearTimer = window.setTimeout(() => {
        setMissDrops((prev) => prev.filter((d) => d.id !== drop.id))
      }, duration)

      return () => {
        cancelled = true
        window.clearTimeout(ackTimer)
        window.clearTimeout(clearTimer)
      }
    }

    // Hit: scan across slots (speed scales hard with mash combo).
    const targets = new Set(
      slots.filter((s) => s.ch === flight.letter).map((s) => s.flat),
    )
    const n = Math.max(1, slots.length)
    let i = 0
    let acc = 0
    let last = performance.now()
    let landing = false
    let landAcc = 0
    let raf = 0

    setFlying(true)
    setCursor(0)
    setLanded(new Set())

    const tick = (now: number) => {
      if (cancelled) return
      const dt = now - last
      last = now
      const step = STEP_MS / Math.pow(speedRef.current, 1.45)

      if (landing) {
        landAcc += dt
        const need = LAND_MS / Math.pow(speedRef.current, 1.2)
        if (landAcc >= need) {
          finish()
          return
        }
        raf = requestAnimationFrame(tick)
        return
      }

      acc += dt
      while (acc >= step && i < n) {
        acc -= step
        const at = i
        setCursor(at)
        if (targets.has(at)) {
          setLanded((prev) => {
            const next = new Set(prev)
            next.add(at)
            return next
          })
        }
        i += 1
      }

      if (i >= n) {
        landing = true
        landAcc = 0
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId])

  const openWord = (index: number) => {
    if (!interactive || wrongFlash) return
    const word = words[index]
    if (!word || isWordRevealed(word, guessed)) return
    if (flashTimer.current !== null) {
      window.clearTimeout(flashTimer.current)
      flashTimer.current = null
    }
    setWrongFlash(false)
    setActiveWord(index)
    setDraft('')
  }

  const submitActive = () => {
    if (activeWord === null || wrongFlash || !onSubmitWord) return
    if (!draft.trim()) return

    const ok = onSubmitWord(activeWord, draft)
    if (ok) {
      closePop()
      return
    }

    setWrongFlash(true)
    flashTimer.current = window.setTimeout(() => {
      flashTimer.current = null
      closePop()
    }, WRONG_FLASH_MS)
  }

  let flatCounter = 0

  return (
    <h1 className="listing-title" aria-label="Product title">
      {missDrops.map((drop) => (
        <span
          key={drop.id}
          className="miss-letter-drop"
          aria-hidden
          style={{
            left: `${drop.left}%`,
            ['--miss-drift' as string]: `${drop.drift}vw`,
            ['--miss-spin' as string]: `${drop.spin}deg`,
            ['--miss-duration' as string]: `${drop.duration}ms`,
          }}
        >
          {drop.letter}
        </span>
      ))}
      {displayWords.map((rawWord, wi) => {
        const norm = words[wi] ?? ''
        const revealed =
          forceReveal || (norm.length > 0 && isWordRevealed(norm, guessed))
        const selected = interactive && activeWord === wi
        const canClick =
          interactive && !revealed && Boolean(onSubmitWord) && !wrongFlash

        const chars = [...rawWord].map((ch) => {
          const flat = flatCounter++
          const committed = forceReveal || isLetterRevealed(ch, guessed)
          const justLanded = landed.has(flat)
          const show = committed || justLanded
          const scanning = flying && cursor === flat

          return (
            <span
              key={flat}
              className={[
                'listing-char',
                show ? 'is-filled' : 'is-blank',
                scanning ? 'is-scan' : '',
                justLanded ? 'is-land' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {show ? ch : '_'}
            </span>
          )
        })

        const wordClass = [
          'listing-word',
          canClick || selected ? 'is-guessable' : '',
          selected ? 'is-selected' : '',
          selected && wrongFlash ? 'is-wrong' : '',
          revealed && interactive ? 'is-revealed' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const wordNode = canClick || selected ? (
          <button
            type="button"
            className={wordClass}
            aria-expanded={selected}
            aria-controls={selected ? `word-guess-pop-${wi}` : undefined}
            aria-label={
              revealed
                ? `Word ${wi + 1} revealed: ${norm}`
                : `Guess word ${wi + 1}, ${norm.length} letters`
            }
            title={`Click to guess this ${norm.length}-letter word`}
            disabled={wrongFlash && !selected}
            onClick={() => openWord(wi)}
          >
            {chars}
          </button>
        ) : (
          <span className={wordClass}>{chars}</span>
        )

        return (
          <span
            key={`${rawWord}-${wi}`}
            className={[
              'listing-word-wrap',
              selected ? 'is-active' : '',
              selected && wrongFlash ? 'is-wrong' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {selected && (
              <form
                ref={popRef}
                id={`word-guess-pop-${wi}`}
                className={[
                  'word-guess-pop',
                  wrongFlash ? 'is-wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="group"
                aria-label={`Type word ${wi + 1}`}
                onSubmit={(e) => {
                  e.preventDefault()
                  submitActive()
                }}
              >
                <input
                  ref={inputRef}
                  className="word-guess-pop-input"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Type word…"
                  aria-label={`Guess for word ${wi + 1}`}
                  aria-invalid={wrongFlash || undefined}
                  value={draft}
                  disabled={wrongFlash}
                  onChange={(e) => setDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  type="submit"
                  className="word-guess-pop-tick"
                  disabled={wrongFlash || !draft.trim()}
                  aria-label="Submit word guess"
                  title="Submit"
                >
                  ✓
                </button>
              </form>
            )}
            {wordNode}
            {wi < displayWords.length - 1 ? (
              <span className="listing-space" aria-hidden>
                {' '}
              </span>
            ) : null}
          </span>
        )
      })}
    </h1>
  )
}
