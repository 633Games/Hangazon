import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { isLetterRevealed, isWordRevealed, titleWords } from '../lib/hangman'

type GuessMode = 'word' | 'title'

type Props = {
  title: string
  guessed: ReadonlySet<string>
  value: string
  onChange: (v: string) => void
  onSubmitWord: (wordIndex: number) => void
  onSubmitTitle: () => void
  disabled?: boolean
  wrong?: boolean
}

export function TitleGuess({
  title,
  guessed,
  value,
  onChange,
  onSubmitWord,
  onSubmitTitle,
  disabled = false,
  wrong = false,
}: Props) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const words = useMemo(() => titleWords(title), [title])
  const [mode, setMode] = useState<GuessMode>('word')
  const [selectedWord, setSelectedWord] = useState<number | null>(() => {
    const firstOpen = words.findIndex((w) => !isWordRevealed(w, guessed))
    return firstOpen >= 0 ? firstOpen : null
  })

  useEffect(() => {
    if (mode !== 'word' || selectedWord === null) return
    const word = words[selectedWord]
    if (!word || isWordRevealed(word, guessed)) {
      const next = words.findIndex((w) => !isWordRevealed(w, guessed))
      setSelectedWord(next >= 0 ? next : null)
    }
  }, [guessed, mode, selectedWord, words])

  const selectWord = (index: number) => {
    if (disabled) return
    const word = words[index]
    if (!word || isWordRevealed(word, guessed)) return
    setMode('word')
    setSelectedWord(index)
    onChange('')
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const enterTitleMode = () => {
    if (disabled) return
    setMode('title')
    setSelectedWord(null)
    onChange('')
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  const canSubmit =
    !disabled &&
    value.trim().length > 0 &&
    (mode === 'title' || selectedWord !== null)

  const placeholder =
    mode === 'title'
      ? 'Type the full title…'
      : selectedWord !== null
        ? `Type word ${selectedWord + 1}…`
        : 'Click a blank word…'

  const ariaLabel =
    mode === 'title'
      ? 'Listing title guess'
      : selectedWord !== null
        ? `Guess for word ${selectedWord + 1}`
        : 'Word guess'

  return (
    <form
      className="title-guess"
      onSubmit={(e) => {
        e.preventDefault()
        if (!canSubmit) return
        if (mode === 'title') {
          onSubmitTitle()
          return
        }
        if (selectedWord !== null) onSubmitWord(selectedWord)
      }}
    >
      <p className="title-guess-label" id={`${inputId}-label`}>
        Guess a word — or the full title
      </p>

      <div className="title-guess-board-row">
        <div
          className="title-guess-words"
          role="list"
          aria-labelledby={`${inputId}-label`}
        >
          {words.map((word, index) => {
            const revealed = isWordRevealed(word, guessed)
            const selected = mode === 'word' && selectedWord === index
            return (
              <button
                key={`${word}-${index}`}
                type="button"
                role="listitem"
                className={[
                  'title-guess-word',
                  revealed ? 'is-revealed' : 'is-blank',
                  selected ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={disabled || revealed}
                aria-pressed={selected}
                aria-label={
                  revealed
                    ? `Word ${index + 1} revealed: ${word}`
                    : `Guess word ${index + 1}, ${word.length} letters`
                }
                title={
                  revealed
                    ? word
                    : `Click to guess this ${word.length}-letter word`
                }
                onClick={() => selectWord(index)}
              >
                {[...word].map((ch, ci) => {
                  const show = revealed || isLetterRevealed(ch, guessed)
                  return (
                    <span
                      key={ci}
                      className={
                        show
                          ? 'title-guess-slot is-filled'
                          : 'title-guess-slot is-empty'
                      }
                    >
                      {show ? ch : '_'}
                    </span>
                  )
                })}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className={[
            'btn btn-ghost title-guess-full',
            mode === 'title' ? 'is-active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          aria-pressed={mode === 'title'}
          onClick={enterTitleMode}
        >
          Guess title
        </button>
      </div>

      <div className="title-guess-row">
        <input
          ref={inputRef}
          id={inputId}
          className="title-guess-input"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={wrong || undefined}
          value={value}
          disabled={disabled || (mode === 'word' && selectedWord === null)}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-guess title-guess-submit"
          disabled={!canSubmit}
        >
          {mode === 'title' ? 'Guess title' : 'Guess word'}
        </button>
      </div>
      {wrong && (
        <p className="title-guess-wrong" role="status">
          Not that {mode === 'title' ? 'listing' : 'word'} — attempt used
        </p>
      )}
    </form>
  )
}
