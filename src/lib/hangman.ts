const LETTER = /[A-Z]/

export function normalizeTitle(title: string): string {
  return title
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function uniqueLetters(title: string): Set<string> {
  const letters = new Set<string>()
  for (const ch of normalizeTitle(title)) {
    if (LETTER.test(ch)) letters.add(ch)
  }
  return letters
}

export function isLetterRevealed(
  ch: string,
  guessed: ReadonlySet<string>,
): boolean {
  if (ch === ' ') return true
  if (!LETTER.test(ch)) return true
  return guessed.has(ch)
}

export function isTitleSolved(
  title: string,
  guessed: ReadonlySet<string>,
): boolean {
  for (const ch of normalizeTitle(title)) {
    if (LETTER.test(ch) && !guessed.has(ch)) return false
  }
  return true
}

/** Full-title / word guess: compare normalized letter+space forms. */
export function titlesMatch(guess: string, title: string): boolean {
  const a = normalizeTitle(guess)
  const b = normalizeTitle(title)
  return a.length > 0 && a === b
}

/** Single word of a normalized title (letters only, uppercased). */
export function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .trim()
}

export function titleWords(title: string): string[] {
  return normalizeTitle(title).split(' ').filter(Boolean)
}

/** True when every letter slot in this word is already revealed. */
export function isWordRevealed(
  word: string,
  guessed: ReadonlySet<string>,
): boolean {
  for (const ch of word) {
    if (LETTER.test(ch) && !guessed.has(ch)) return false
  }
  return word.length > 0
}

/** Guess matches the word at `index` in the normalized title. */
export function wordMatches(
  guess: string,
  title: string,
  index: number,
): boolean {
  const words = titleWords(title)
  const target = words[index]
  if (!target) return false
  const a = normalizeWord(guess)
  return a.length > 0 && a === target
}

export const MAX_MISSES = 6

export function zoomScale(misses: number, revealed: boolean): number {
  if (revealed) return 1
  // Start very tight; each miss pulls back a little
  const start = 4.2
  const end = 1.35
  const t = Math.min(1, misses / MAX_MISSES)
  return start - (start - end) * t
}
