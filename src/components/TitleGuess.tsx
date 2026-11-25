import { useId, useRef } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  wrong?: boolean
}

/** Buy-box full listing title guess only (per-word guesses live on the title). */
export function TitleGuess({
  value,
  onChange,
  onSubmit,
  disabled = false,
  wrong = false,
}: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const canSubmit = !disabled && value.trim().length > 0

  return (
    <form
      className="title-guess"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSubmit()
      }}
    >
      <p className="title-guess-label" id={`${inputId}-label`}>
        Or guess the full title
      </p>

      <div className="title-guess-row">
        <input
          ref={inputRef}
          id={inputId}
          className="title-guess-input"
          autoComplete="off"
          spellCheck={false}
          placeholder="Type the full title…"
          aria-label="Listing title guess"
          aria-labelledby={`${inputId}-label`}
          aria-invalid={wrong || undefined}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-guess title-guess-submit"
          disabled={!canSubmit}
        >
          Guess title
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
