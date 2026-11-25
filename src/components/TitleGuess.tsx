type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  wrong?: boolean
}

export function TitleGuess({
  value,
  onChange,
  onSubmit,
  disabled = false,
  wrong = false,
}: Props) {
  return (
    <form
      className="title-guess"
      onSubmit={(e) => {
        e.preventDefault()
        if (disabled) return
        onSubmit()
      }}
    >
      <label className="title-guess-label" htmlFor="title-guess">
        Guess the listing title
      </label>
      <div className="title-guess-row">
        <input
          id="title-guess"
          className="title-guess-input"
          autoComplete="off"
          spellCheck={false}
          placeholder="Type the full title…"
          aria-label="Listing title guess"
          aria-invalid={wrong || undefined}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-guess title-guess-submit"
          disabled={disabled || value.trim().length === 0}
        >
          Guess
        </button>
      </div>
      {wrong && (
        <p className="title-guess-wrong" role="status">
          Not that listing — attempt used
        </p>
      )}
    </form>
  )
}
