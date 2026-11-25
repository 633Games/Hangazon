/**
 * Amazon Associates tag — public by design (appears in every affiliate URL).
 * Replace with your own tag from associates.amazon.com.
 * For live ads later: Product Advertising API (server-side secrets only).
 */
export const ASSOCIATE_TAG = 'hangazon-20'

export function affiliateUrl(asin: string, tag = ASSOCIATE_TAG): string {
  const url = new URL(`https://www.amazon.com/dp/${encodeURIComponent(asin)}`)
  url.searchParams.set('tag', tag)
  return url.toString()
}
