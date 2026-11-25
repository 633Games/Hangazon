type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}

export function PriceGuess({ value, onChange, onSubmit }: Props) {
  return (
    <form
      className="price-panel"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="price-input-row">
        <span className="price-currency">$</span>
        <input
          id="price-guess"
          className="price-input"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          aria-label="Price"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          Score
        </button>
      </div>
    </form>
  )
}
