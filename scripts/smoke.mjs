import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE = process.env.HANGAZON_URL || 'http://127.0.0.1:4173/'
const OUT = path.resolve('demo/smoke')

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({
  headless: false,
  channel: 'chrome',
  args: ['--window-size=1280,800'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const log = []

function note(msg) {
  console.log(msg)
  log.push(msg)
}

try {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('.brand-hero')
  note('hero: Hangazon brand visible')

  const hasSearch = await page.locator('.topbar-search').isVisible()
  const hasSubnav = await page.locator('.subnav').isVisible()
  note(`chrome: topbar-search=${hasSearch} subnav=${hasSubnav}`)

  await page.screenshot({ path: path.join(OUT, '01-hero.png'), fullPage: true })

  // Local product image on hero
  const heroSrc = await page.locator('.hero-img').getAttribute('src')
  if (!heroSrc?.startsWith('/products/')) {
    throw new Error(`expected local product image, got ${heroSrc}`)
  }
  note(`hero image: ${heroSrc}`)

  await page.getByRole('button', { name: /^Random$/i }).click()
  await page.waitForSelector('.key')
  note('round: letter keyboard visible')
  await page.screenshot({ path: path.join(OUT, '02-letters.png'), fullPage: true })

  // Early exit with blank-space bonus
  await page.getByRole('button', { name: /Have a Guess/i }).click()
  await page.waitForSelector('.price-input', { timeout: 10000 })
  note('price: guess panel after Have a Guess')
  await page.screenshot({ path: path.join(OUT, '03-price.png'), fullPage: true })

  await page.fill('.price-input', '29.99')
  await page.locator('.price-input').press('Enter')
  await page.waitForSelector('.buybox, .reveal-panel', { timeout: 10000 })
  note('reveal: buy box visible')

  const brand = await page.locator('.buybox-brand').textContent()
  const stars = await page.locator('.stars').count()
  const price = await page.locator('.buybox-now').textContent()
  const bonus = await page.locator('.blank-bonus').count()
  const href = await page.locator('a.btn-cart').getAttribute('href')
  note(`reveal: brand=${brand?.trim()} stars=${stars} price=${price?.trim()} bonus=${bonus}`)
  note(`affiliate: ${href}`)

  if (bonus < 1) throw new Error('expected blank-bonus after Have a Guess')
  const okTag = href?.includes('tag=hangazon-21')
  const okUk = href?.includes('amazon.co.uk')
  if (!okTag || !okUk) throw new Error(`bad affiliate url: ${href}`)
  note('affiliate: hangazon-21 on amazon.co.uk OK')

  await page.screenshot({ path: path.join(OUT, '04-reveal.png'), fullPage: true })
  await page.waitForTimeout(800)

  console.log(JSON.stringify({ ok: true, log }, null, 2))
} catch (err) {
  await page.screenshot({ path: path.join(OUT, 'fail.png'), fullPage: true }).catch(() => {})
  console.error(JSON.stringify({ ok: false, error: String(err), log }, null, 2))
  process.exitCode = 1
} finally {
  await browser.close()
}
