import { AnimatePresence, motion } from 'framer-motion'
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

const STEP_MS = 68
const LAND_MS = 140

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

    setFlying(true)
    setCursor(0)
    setLanded(new Set())

    const timers: number[] = []
    const n = slots.length

    for (let i = 0; i < n; i++) {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setCursor(i)
          if (flight.hit && targets.has(i)) {
            setLanded((prev) => {
              const next = new Set(prev)
              next.add(i)
              return next
            })
          }
        }, i * STEP_MS),
      )
    }

    const doneAt = Math.max(1, n) * STEP_MS + (flight.hit ? LAND_MS : 110)
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        setFlying(false)
        setCursor(-1)
        doneRef.current()
      }, doneAt),
    )

    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
    }
    // Only re-run when a new flight id starts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId])

  const words = title.split(' ')
  let flatCounter = 0

  return (
    <div className="letter-board" aria-label="Product title">
      {words.map((word, wi) => (
        <div className="letter-word" key={`${word}-${wi}`}>
          {[...word].map((ch) => {
            const flat = flatCounter++
            const committed = forceReveal || isLetterRevealed(ch, guessed)
            const justLanded = landed.has(flat)
            const show = committed || justLanded
            const scanning = flying && cursor === flat
            const passed = flying && cursor > flat

            return (
              <span
                key={flat}
                className={[
                  'letter-slot',
                  show ? 'is-revealed' : '',
                  scanning ? 'is-scan' : '',
                  passed && !show ? 'is-passed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <AnimatePresence>
                  {show && (
                    <motion.span
                      key={`g-${flat}`}
                      className="letter-glyph"
                      initial={
                        justLanded
                          ? { opacity: 0, y: -16, scale: 1.4 }
                          : { opacity: 1, y: 0, scale: 1 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 460,
                        damping: 24,
                      }}
                    >
                      {ch}
                    </motion.span>
                  )}
                </AnimatePresence>
                {scanning && <span className="scan-beam" />}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
