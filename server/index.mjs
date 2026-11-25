import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleApi } from './api.mjs'
import { credentialsReady } from './amazon.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const port = Number(process.env.PORT || 8787)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

function sendStatic(res, filePath) {
  try {
    const body = readFileSync(filePath)
    res.setHeader(
      'Content-Type',
      MIME[extname(filePath)] || 'application/octet-stream',
    )
    res.end(body)
  } catch {
    res.statusCode = 404
    res.end('Not found')
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)

  if (url.pathname.startsWith('/api/')) {
    try {
      await handleApi(req, res, url)
    } catch (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'server_error' }))
      console.error(err)
    }
    return
  }

  if (!existsSync(dist)) {
    res.statusCode = 503
    res.end('Build missing — run npm run build')
    return
  }

  const rel = url.pathname === '/' ? '/index.html' : url.pathname
  const filePath = join(dist, rel)
  if (existsSync(filePath) && !rel.endsWith('/')) {
    sendStatic(res, filePath)
    return
  }
  sendStatic(res, join(dist, 'index.html'))
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Hangazon on http://127.0.0.1:${port}`)
  console.log(
    credentialsReady()
      ? 'PA-API: live'
      : 'PA-API: sample fallback (set AMAZON_PAAPI_* + AMAZON_ASSOCIATE_TAG)',
  )
})
