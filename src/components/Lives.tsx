import { MAX_MISSES } from '../lib/hangman'

type Props = {
  misses: number
}

export function Lives({ misses }: Props) {
  const left = Math.max(0, MAX_MISSES - misses)
  return (
    <div className="lives" aria-label={`${left} lives left`}>
      {Array.from({ length: MAX_MISSES }, (_, i) => {
        const gone = i < misses
        return (
          <span
            key={i}
            className={`life${gone ? ' is-gone' : ''}`}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        )
      })}
    </div>
  )
}
