/** Price accuracy 0–100: how close the guess is to the true price. */
export function priceAccuracy(guess: number, actual: number): number {
  if (!Number.isFinite(guess) || guess < 0) return 0
  if (actual <= 0) return 0
  const pctOff = Math.abs(guess - actual) / actual
  return Math.round(Math.max(0, Math.min(100, (1 - pctOff) * 100)))
}

/**
 * Early “Have a Guess” bonus: more blank letter slots left → bigger boost.
 * Up to +55 on top of price accuracy (capped at 100).
 */
export function blankSpaceBonus(
  blanksLeft: number,
  totalLetters: number,
): number {
  if (totalLetters <= 0 || blanksLeft <= 0) return 0
  const ratio = Math.min(1, blanksLeft / totalLetters)
  return Math.round(ratio * 55)
}

export function finalScore(opts: {
  priceGuess: number
  actualPrice: number
  blanksLeft: number
  totalLetters: number
}): number {
  const base = priceAccuracy(opts.priceGuess, opts.actualPrice)
  const bonus = blankSpaceBonus(opts.blanksLeft, opts.totalLetters)
  return Math.round(Math.max(0, Math.min(100, base + bonus)))
}

export function countLetterSlots(title: string): number {
  let n = 0
  for (const ch of title) {
    if (/[A-Z]/.test(ch)) n += 1
  }
  return n
}

export function countBlanksLeft(
  title: string,
  guessed: ReadonlySet<string>,
): number {
  let n = 0
  for (const ch of title) {
    if (/[A-Z]/.test(ch) && !guessed.has(ch)) n += 1
  }
  return n
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}
