const LETTER = /[A-Z]/

export function normalizeTitle(title: string): string {
  return title.toUpperCase().replace(/[^A-Z\s]/g, '')
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

export const MAX_MISSES = 6

export function zoomScale(misses: number, revealed: boolean): number {
  if (revealed) return 1
  // Start very tight; each miss pulls back a little
  const start = 4.2
  const end = 1.35
  const t = Math.min(1, misses / MAX_MISSES)
  return start - (start - end) * t
}
