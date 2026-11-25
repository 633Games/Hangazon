import { MAX_MISSES } from '../lib/hangman'

type Props = {
  misses: number
}

export function Lives({ misses }: Props) {
  const left = Math.max(0, MAX_MISSES - misses)
  return (
    <div
      className="attempts"
      role="status"
      aria-label={`${left} of ${MAX_MISSES} attempts left`}
    >
      <p className="attempts-label">
        Attempts left · <strong>{left}</strong> of {MAX_MISSES}
      </p>
      <div className="attempts-pips" aria-hidden>
        {Array.from({ length: MAX_MISSES }, (_, i) => {
          const used = i < misses
          return (
            <span
              key={i}
              className={`attempt-pip${used ? ' is-used' : ''}`}
              title={used ? 'Wrong guess' : 'Attempt remaining'}
            >
              {used ? '✗' : '●'}
            </span>
          )
        })}
      </div>
    </div>
  )
}
