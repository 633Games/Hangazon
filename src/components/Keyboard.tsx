const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

type Props = {
  guessed: ReadonlySet<string>
  /** Letters present in the puzzle — avoids passing the full title into this tree. */
  titleLetters: ReadonlySet<string>
  disabled?: boolean
  pending?: ReadonlySet<string>
  onGuess: (letter: string) => void
}

export function Keyboard({
  guessed,
  titleLetters,
  disabled,
  pending,
  onGuess,
}: Props) {
  return (
    <div className="keyboard" role="group" aria-label="Letter keyboard">
      {ROWS.map((row) => (
        <div className="keyboard-row" key={row}>
          {[...row].map((letter) => {
            const used = guessed.has(letter)
            const hit = used && titleLetters.has(letter)
            const miss = used && !hit
            const isPending = pending?.has(letter) ?? false
            return (
              <button
                key={letter}
                type="button"
                className={`key${hit ? ' is-hit' : ''}${miss ? ' is-miss' : ''}${isPending ? ' is-pending' : ''}`}
                disabled={disabled || used || isPending}
                onClick={() => onGuess(letter)}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
