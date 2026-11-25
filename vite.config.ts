import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

function hangazonApiPlugin(): Plugin {
  return {
    name: 'hangazon-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()
        try {
          const { handleApi } = await server.ssrLoadModule('/server/api.mjs')
          const host = req.headers.host || '127.0.0.1'
          const url = new URL(req.url, `http://${host}`)
          await handleApi(req, res, url)
        } catch (err) {
          console.error('[hangazon-api]', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'api_error' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), hangazonApiPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
