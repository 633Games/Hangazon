import { useEffect, useMemo, useRef, useState } from 'react'
import { isLetterRevealed } from '../lib/hangman'
import type { LetterFlight } from '../hooks/useHangazonRound'

type Props = {
  title: string
  guessed: ReadonlySet<string>
  forceReveal?: boolean
  flight: LetterFlight | null
  onFlightDone: () => void
}

const STEP_MS = 52
const LAND_MS = 100
const MISS_TAIL_MS = 90

export function LetterBoard({
  title,
  guessed,
  forceReveal,
  flight,
  onFlightDone,
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

  const doneRef = useRef(onFlightDone)
  doneRef.current = onFlightDone
  const speedRef = useRef(1)
  speedRef.current = Math.max(1, flight?.speed ?? 1)

  const [cursor, setCursor] = useState(-1)
  const [landed, setLanded] = useState<Set<number>>(() => new Set())
  const [flying, setFlying] = useState(false)
  const flightId = flight?.id ?? null

  useEffect(() => {
    if (!flight) {
      setCursor(-1)
      setLanded(new Set())
      setFlying(false)
      return
    }

    let cancelled = false
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

    const finish = () => {
      if (cancelled) return
      setFlying(false)
      setCursor(-1)
      doneRef.current()
    }

    const tick = (now: number) => {
      if (cancelled) return
      const dt = now - last
      last = now
      const step = STEP_MS / speedRef.current

      if (landing) {
        landAcc += dt
        const need =
          (flight.hit ? LAND_MS : MISS_TAIL_MS) / speedRef.current
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
        if (flight.hit && targets.has(at)) {
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

  const words = title.split(' ')
  let flatCounter = 0

  return (
    <h1 className="listing-title" aria-label="Product title">
      {words.map((word, wi) => (
        <span className="listing-word" key={`${word}-${wi}`}>
          {[...word].map((ch) => {
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
          })}
          {wi < words.length - 1 ? (
            <span className="listing-space" aria-hidden>
              {' '}
            </span>
          ) : null}
        </span>
      ))}
    </h1>
  )
}
