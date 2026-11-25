import { ASSOCIATE_TAG } from './catalog'

/**
 * Prefer the baked affiliate URL on the product.
 * Falls back to a UK dp link with hangazon-21.
 */
export function affiliateUrl(
  asin: string,
  bakedUrl?: string | null,
): string {
  if (bakedUrl) {
    try {
      const u = new URL(bakedUrl)
      u.searchParams.set('tag', ASSOCIATE_TAG)
      return u.toString()
    } catch {
      /* fall through */
    }
  }
  const url = new URL(
    `https://www.amazon.co.uk/dp/${encodeURIComponent(asin)}`,
  )
  url.searchParams.set('tag', ASSOCIATE_TAG)
  return url.toString()
}
