import { affiliateUrl } from '../lib/affiliate'
import { formatMoney } from '../lib/scoring'
import type { Product } from '../data/products'

type Props = {
  product: Product
  priceScore: number
  priceGuess: string
  letterOutcome: 'win' | 'lose' | null
  onAgain: () => void
}

export function Reveal({
  product,
  priceScore,
  priceGuess,
  letterOutcome,
  onAgain,
}: Props) {
  const guessNum = Number.parseFloat(priceGuess.replace(/[^0-9.]/g, ''))
  const href = affiliateUrl(product.asin)

  return (
    <div className="reveal-panel">
      <p className="reveal-kicker">
        {letterOutcome === 'win' ? 'Listing solved' : 'Listing revealed'} · Price
        score
      </p>
      <div
        className="score-ring"
        style={{ ['--p' as string]: String(priceScore) }}
        aria-label={`Price accuracy ${priceScore} percent`}
      >
        <span className="score-value">{priceScore}%</span>
        <span className="score-label">accuracy</span>
      </div>
      <h2 className="reveal-title">{product.title}</h2>
      <p className="reveal-prices">
        You guessed{' '}
        <strong>
          {Number.isFinite(guessNum) ? formatMoney(guessNum) : '—'}
        </strong>
        {' · '}Actual <strong>{formatMoney(product.price)}</strong>
      </p>
      <p className="reveal-sample">
        Sample catalog listing — affiliate link uses your Associates tag.
      </p>
      <div className="reveal-actions">
        <a
          className="btn btn-primary"
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          View on Amazon
        </a>
        <button type="button" className="btn btn-ghost" onClick={onAgain}>
          Next product
        </button>
      </div>
    </div>
  )
}
