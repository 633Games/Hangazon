import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Local/dev: base `/` → http://127.0.0.1:5173/
 * GitHub Pages (project): base `/Hangazon/` → https://633games.github.io/Hangazon/
 *
 * Build for Pages with: npm run build:pages
 */
export default defineConfig(({ mode }) => {
  const pages = mode === 'pages'
  return {
    base: pages ? '/Hangazon/' : '/',
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      // Dev defaults omit X-Frame-Options; keep it that way for embed tests.
    },
    preview: {
      host: '127.0.0.1',
      port: 4173,
      // Intentionally no X-Frame-Options / CSP frame-ancestors — iframe-friendly.
      headers: {
        // Explicit allow-all framing for local preview smoke (GH Pages cannot set this).
        'Content-Security-Policy': 'frame-ancestors *',
      },
    },
  }
})
