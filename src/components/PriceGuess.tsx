type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  letterOutcome: 'win' | 'lose' | null
}

export function PriceGuess({
  value,
  onChange,
  onSubmit,
  letterOutcome,
}: Props) {
  return (
    <form
      className="price-panel"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <p className="price-kicker">
        {letterOutcome === 'win'
          ? 'You cracked the listing. Now nail the price.'
          : 'Out of letters — still take a shot at the price.'}
      </p>
      <label className="price-label" htmlFor="price-guess">
        What does it sell for?
      </label>
      <div className="price-input-row">
        <span className="price-currency">$</span>
        <input
          id="price-guess"
          className="price-input"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          Lock in
        </button>
      </div>
    </form>
  )
}
