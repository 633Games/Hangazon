type Props = {
  rating: number
  reviews?: number
}

export function Stars({ rating, reviews }: Props) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.4
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      <span className="stars-glyphs" aria-hidden>
        {'★★★★★'.split('').map((s, i) => (
          <span
            key={i}
            className={
              i < full ? 'is-on' : i === full && half ? 'is-half' : 'is-off'
            }
          >
            {s}
          </span>
        ))}
      </span>
      <span className="stars-score">{rating.toFixed(1)}</span>
      {typeof reviews === 'number' && (
        <span className="stars-count">
          ({reviews.toLocaleString('en-GB')} ratings)
        </span>
      )}
    </div>
  )
}
