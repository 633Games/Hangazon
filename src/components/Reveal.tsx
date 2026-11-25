import { affiliateUrl } from '../lib/affiliate'
import { formatMoney } from '../lib/scoring'
import type { Product } from '../data/products'

type Props = {
  product: Product
  priceScore: number
  priceGuess: string
  againLabel?: string
  onAgain: () => void
}

export function Reveal({
  product,
  priceScore,
  priceGuess,
  againLabel = 'Again',
  onAgain,
}: Props) {
  const guessNum = Number.parseFloat(priceGuess.replace(/[^0-9.]/g, ''))
  const href = affiliateUrl(product.asin)

  return (
    <div className="reveal-panel">
      <div
        className="score-ring"
        style={{ ['--p' as string]: String(priceScore) }}
        aria-label={`${priceScore}%`}
      >
        <span className="score-value">{priceScore}%</span>
      </div>
      <p className="reveal-aisle">{product.category}</p>
      <h2 className="reveal-title">{product.title}</h2>
      <p className="reveal-prices">
        <strong>
          {Number.isFinite(guessNum) ? formatMoney(guessNum) : '—'}
        </strong>
        <span aria-hidden> → </span>
        <strong>{formatMoney(product.price)}</strong>
      </p>
      <div className="reveal-actions">
        <a
          className="btn btn-primary"
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          Amazon
        </a>
        <button type="button" className="btn btn-ghost" onClick={onAgain}>
          {againLabel}
        </button>
      </div>
    </div>
  )
}
