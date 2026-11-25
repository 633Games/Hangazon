import { affiliateUrl } from '../lib/affiliate'
import { formatMoney } from '../lib/scoring'
import type { Product } from '../data/products'
import { Stars } from './Stars'

type Props = {
  product: Product
  priceScore: number
  priceGuess: string
  blankBonus?: number
  blanksAtGuess?: number
  againLabel?: string
  onAgain: () => void
}

export function Reveal({
  product,
  priceScore,
  priceGuess,
  blankBonus = 0,
  blanksAtGuess = 0,
  againLabel = 'Again',
  onAgain,
}: Props) {
  const guessNum = Number.parseFloat(priceGuess.replace(/[^0-9.]/g, ''))
  const href = affiliateUrl(product.asin, product.affiliateUrl)

  return (
    <div className="reveal-panel buybox">
      <div
        className="score-ring"
        style={{ ['--p' as string]: String(priceScore) }}
        aria-label={`${priceScore}%`}
      >
        <span className="score-value">{priceScore}%</span>
      </div>

      {blankBonus > 0 && (
        <p className="blank-bonus">
          Early guess · {blanksAtGuess} blank
          {blanksAtGuess === 1 ? '' : 's'} left · +{blankBonus}
        </p>
      )}

      <p className="reveal-aisle">
        {product.category}
        {product.prime ? ' · Prime' : ''}
      </p>
      <p className="buybox-brand">Brand: {product.brand}</p>
      <h2 className="reveal-title">{product.title}</h2>
      <Stars rating={product.rating} reviews={product.reviews} />
      <p className="buybox-blurb">{product.blurb}</p>

      <div className="buybox-price">
        {product.listPrice != null && product.listPrice > product.price && (
          <span className="buybox-was">{formatMoney(product.listPrice)}</span>
        )}
        <span className="buybox-now">{formatMoney(product.price)}</span>
      </div>

      <p className="reveal-prices">
        Your guess{' '}
        <strong>
          {Number.isFinite(guessNum) ? formatMoney(guessNum) : '—'}
        </strong>
      </p>

      <div className="reveal-actions">
        <a
          className="btn btn-primary btn-cart"
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          View on Amazon
        </a>
        <button type="button" className="btn btn-ghost" onClick={onAgain}>
          {againLabel}
        </button>
      </div>
    </div>
  )
}
