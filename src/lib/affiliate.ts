import { getAssociateTag } from './catalog'

/** Build an Associates URL. Tag comes from /api/status when live. */
export function affiliateUrl(asin: string, detailUrl?: string | null): string {
  if (detailUrl) {
    try {
      const u = new URL(detailUrl)
      u.searchParams.set('tag', getAssociateTag())
      return u.toString()
    } catch {
      /* fall through */
    }
  }
  const url = new URL(`https://www.amazon.com/dp/${encodeURIComponent(asin)}`)
  url.searchParams.set('tag', getAssociateTag())
  return url.toString()
}
