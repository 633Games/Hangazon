const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

type Props = {
  guessed: ReadonlySet<string>
  title: string
  disabled?: boolean
  onGuess: (letter: string) => void
}

export function Keyboard({ guessed, title, disabled, onGuess }: Props) {
  return (
    <div className="keyboard" role="group" aria-label="Letter keyboard">
      {ROWS.map((row) => (
        <div className="keyboard-row" key={row}>
          {[...row].map((letter) => {
            const used = guessed.has(letter)
            const hit = used && title.includes(letter)
            const miss = used && !hit
            return (
              <button
                key={letter}
                type="button"
                className={`key${hit ? ' is-hit' : ''}${miss ? ' is-miss' : ''}`}
                disabled={disabled || used}
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
