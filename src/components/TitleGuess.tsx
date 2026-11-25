import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isWordRevealed, titleWords } from '../lib/hangman'

type GuessMode = 'word' | 'title'

export type TitleGuessHandle = {
  selectWord: (index: number) => void
}

type Props = {
  title: string
  guessed: ReadonlySet<string>
  value: string
  onChange: (v: string) => void
  onSubmitWord: (wordIndex: number) => void
  onSubmitTitle: () => void
  disabled?: boolean
  wrong?: boolean
  /** Sync selection highlight to the main listing title blanks. */
  onActiveChange?: (state: {
    mode: GuessMode
    wordIndex: number | null
  }) => void
}

export const TitleGuess = forwardRef<TitleGuessHandle, Props>(
  function TitleGuess(
    {
      title,
      guessed,
      value,
      onChange,
      onSubmitWord,
      onSubmitTitle,
      disabled = false,
      wrong = false,
      onActiveChange,
    },
    ref,
  ) {
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

    useEffect(() => {
      onActiveChange?.({ mode, wordIndex: selectedWord })
    }, [mode, selectedWord, onActiveChange])

    const selectWord = (index: number) => {
      if (disabled) return
      const word = words[index]
      if (!word || isWordRevealed(word, guessed)) return
      setMode('word')
      setSelectedWord(index)
      onChange('')
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }

    useImperativeHandle(ref, () => ({ selectWord }), [
      disabled,
      guessed,
      onChange,
      words,
    ])

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
          : 'Click a blank word in the title…'

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
          Click a blank in the title — or guess the full title
        </p>

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

        <div className="title-guess-row">
          <input
            ref={inputRef}
            id={inputId}
            className="title-guess-input"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-labelledby={`${inputId}-label`}
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
  },
)
