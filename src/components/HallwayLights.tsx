import { motion } from 'framer-motion'
import { MAX_MISSES } from '../lib/hangman'

type Props = {
  misses: number
  revealed: boolean
}

/** Bay lights along the frame — each miss kills the next fixture. */
export function HallwayLights({ misses, revealed }: Props) {
  if (revealed) return null

  return (
    <div className="hallway" aria-hidden>
      <div className="hallway-bays">
        {Array.from({ length: MAX_MISSES }, (_, i) => {
          const on = i >= misses
          return (
            <motion.span
              key={i}
              className="hallway-fixture"
              initial={false}
              animate={{
                opacity: on ? 1 : 0,
                boxShadow: on
                  ? '0 18px 40px rgba(255, 210, 140, 0.28)'
                  : '0 0 0 rgba(0,0,0,0)',
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          )
        })}
      </div>
      <motion.div
        className="hallway-blackout"
        initial={false}
        animate={{ opacity: Math.min(0.78, misses * 0.12) }}
        transition={{ duration: 0.55 }}
      />
    </div>
  )
}
