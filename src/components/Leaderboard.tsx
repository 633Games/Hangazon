import { motion, useReducedMotion } from 'framer-motion'
import type { BoardEntry } from '../lib/leaderboard'

type Props = {
  entries: readonly BoardEntry[]
  boardAvg: number
  localAvg: number
  highlightId?: string | null
  title?: string
}

export function Leaderboard({
  entries,
  boardAvg,
  localAvg,
  highlightId,
  title = 'Climb leaderboard',
}: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="scroll-board" aria-label={title}>
      <header className="scroll-board-head">
        <h2 className="scroll-board-title">{title}</h2>
        <p className="scroll-board-avgs">
          <span>
            Board avg{' '}
            <motion.strong
              key={`board-avg-${boardAvg}`}
              initial={reduceMotion ? false : { opacity: 0.45, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              {boardAvg}%
            </motion.strong>
          </span>
          <span className="scroll-board-avgs-sep" aria-hidden>
            ·
          </span>
          <span>
            Your avg <strong>{localAvg}%</strong>
          </span>
        </p>
      </header>

      <div className="scroll-board-list" role="table" aria-label={title}>
        <div className="scroll-board-list-head" role="row">
          <span role="columnheader">#</span>
          <span role="columnheader">Name</span>
          <span role="columnheader">Clears</span>
          <span role="columnheader">Avg %</span>
        </div>
        <div className="scroll-board-list-body" role="rowgroup">
          {entries.map((row, i) => {
            const mine = row.id === highlightId || row.local
            const rowClass =
              row.id === highlightId
                ? 'is-you'
                : mine
                  ? 'is-local'
                  : undefined
            return (
              <motion.div
                key={row.id}
                layout={!reduceMotion}
                role="row"
                className={['scroll-board-row', rowClass]
                  .filter(Boolean)
                  .join(' ')}
                transition={{
                  layout: {
                    type: 'spring',
                    stiffness: 420,
                    damping: 34,
                    mass: 0.85,
                  },
                }}
              >
                <span className="scroll-board-cell is-rank" role="cell">
                  {i + 1}
                </span>
                <span className="scroll-board-cell is-name" role="cell">
                  {row.name}
                  {row.id === highlightId ? (
                    <span className="scroll-board-you"> you</span>
                  ) : null}
                </span>
                <motion.span
                  key={`${row.id}-clears-${row.clears}`}
                  className="scroll-board-cell is-clears"
                  role="cell"
                  initial={
                    reduceMotion ? false : { scale: 1.18, color: '#e47911' }
                  }
                  animate={{ scale: 1, color: 'var(--ink)' }}
                  transition={{ type: 'spring', stiffness: 480, damping: 28 }}
                >
                  {row.clears}
                </motion.span>
                <motion.span
                  key={`${row.id}-avg-${row.avgPct}`}
                  className="scroll-board-cell is-avg"
                  role="cell"
                  initial={
                    reduceMotion ? false : { scale: 1.18, color: '#e47911' }
                  }
                  animate={{ scale: 1, color: 'var(--ink)' }}
                  transition={{ type: 'spring', stiffness: 480, damping: 28 }}
                >
                  {row.avgPct}%
                </motion.span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
