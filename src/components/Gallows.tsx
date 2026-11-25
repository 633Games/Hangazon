import { MAX_MISSES } from '../lib/hangman'

type Props = {
  misses: number
}

export function Gallows({ misses }: Props) {
  const parts = [
    misses >= 1,
    misses >= 2,
    misses >= 3,
    misses >= 4,
    misses >= 5,
    misses >= 6,
  ]

  return (
    <div className="gallows" aria-label={`${misses} of ${MAX_MISSES} misses`}>
      <svg viewBox="0 0 120 140" className="gallows-svg" aria-hidden>
        <path
          d="M18 128 H102 M36 128 V18 H84 V32"
          className="gallows-beam"
          fill="none"
        />
        <path
          d="M84 32 V40"
          className={`gallows-part${parts[0] ? ' is-on' : ''}`}
          fill="none"
        />
        <circle
          cx="84"
          cy="52"
          r="11"
          className={`gallows-part gallows-head${parts[0] ? ' is-on' : ''}`}
        />
        <line
          x1="84"
          y1="63"
          x2="84"
          y2="94"
          className={`gallows-part${parts[1] ? ' is-on' : ''}`}
        />
        <line
          x1="84"
          y1="72"
          x2="66"
          y2="86"
          className={`gallows-part${parts[2] ? ' is-on' : ''}`}
        />
        <line
          x1="84"
          y1="72"
          x2="102"
          y2="86"
          className={`gallows-part${parts[3] ? ' is-on' : ''}`}
        />
        <line
          x1="84"
          y1="94"
          x2="68"
          y2="116"
          className={`gallows-part${parts[4] ? ' is-on' : ''}`}
        />
        <line
          x1="84"
          y1="94"
          x2="100"
          y2="116"
          className={`gallows-part${parts[5] ? ' is-on' : ''}`}
        />
      </svg>
    </div>
  )
}
