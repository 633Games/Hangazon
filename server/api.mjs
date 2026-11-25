import { associateTag, credentialsReady, fetchLiveProduct } from './amazon.mjs'

export async function handleApi(req, res, url) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (url.pathname === '/api/status') {
    res.end(
      JSON.stringify({
        live: credentialsReady(),
        associateTag: associateTag(),
      }),
    )
    return
  }

  if (url.pathname === '/api/product') {
    const mode = url.searchParams.get('mode') === 'daily' ? 'daily' : 'random'
    const category = url.searchParams.get('category') || 'All'
    const dayKey = url.searchParams.get('day') || undefined
    const excludeId = url.searchParams.get('exclude') || undefined

    const product = await fetchLiveProduct({
      mode,
      category,
      dayKey,
      excludeId,
    })

    if (!product) {
      res.statusCode = 204
      res.end()
      return
    }

    res.end(
      JSON.stringify({
        source: 'amazon',
        associateTag: associateTag(),
        product,
      }),
    )
    return
  }

  res.statusCode = 404
  res.end(JSON.stringify({ error: 'not_found' }))
}
