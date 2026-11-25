/** Price accuracy 0–100: how close the guess is to the true price. */
export function priceAccuracy(guess: number, actual: number): number {
  if (!Number.isFinite(guess) || guess < 0) return 0
  if (actual <= 0) return 0
  const pctOff = Math.abs(guess - actual) / actual
  return Math.round(Math.max(0, Math.min(100, (1 - pctOff) * 100)))
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}
