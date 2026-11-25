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
const MISS_TAIL_MS = 110

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
    <div
      className="letter-board"
      aria-label="Product title"
      data-speed={flight?.speed ?? 1}
    >
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
                        stiffness: 460 + (flight?.speed ?? 1) * 40,
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
