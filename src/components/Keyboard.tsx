const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

type Props = {
  guessed: ReadonlySet<string>
  title: string
  disabled?: boolean
  pending?: string | null
  onGuess: (letter: string) => void
}

export function Keyboard({
  guessed,
  title,
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
            const hit = used && title.includes(letter)
            const miss = used && !hit
            const isPending = pending === letter
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
