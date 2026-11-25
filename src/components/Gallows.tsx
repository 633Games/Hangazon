import { MAX_MISSES } from '../lib/hangman'

type Props = {
  misses: number
}

export function Gallows({ misses }: Props) {
  const parts = [
    misses >= 1, // head
    misses >= 2, // body
    misses >= 3, // left arm
    misses >= 4, // right arm
    misses >= 5, // left leg
    misses >= 6, // right leg
  ]

  return (
    <div className="gallows" aria-label={`${misses} of ${MAX_MISSES} misses`}>
      <svg viewBox="0 0 120 140" className="gallows-svg" aria-hidden>
        <path
          d="M20 130 H100 M40 130 V20 H80 V35"
          className="gallows-beam"
          fill="none"
        />
        {parts[0] && <circle cx="80" cy="48" r="12" className="gallows-part" />}
        {parts[1] && <line x1="80" y1="60" x2="80" y2="92" className="gallows-part" />}
        {parts[2] && <line x1="80" y1="70" x2="62" y2="84" className="gallows-part" />}
        {parts[3] && <line x1="80" y1="70" x2="98" y2="84" className="gallows-part" />}
        {parts[4] && <line x1="80" y1="92" x2="64" y2="114" className="gallows-part" />}
        {parts[5] && <line x1="80" y1="92" x2="96" y2="114" className="gallows-part" />}
      </svg>
      <span className="gallows-count">
        {misses}/{MAX_MISSES}
      </span>
    </div>
  )
}
