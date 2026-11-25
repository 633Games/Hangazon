import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.reload({ waitUntil: 'networkidle' })

const startLabel = await page
  .getByRole('button', { name: /Start the Climb/i })
  .innerText()
const boardVisible = await page.locator('.scroll-board').isVisible()
const boardAvg = await page.locator('.scroll-board-avgs').innerText()

await page.getByRole('button', { name: /Start the Climb/i }).click()
await page.waitForSelector('.key')

for (const L of 'ZQXVJKWYBFGPUHD') {
  const btn = page.getByRole('button', { name: L, exact: true })
  if (!(await btn.count()) || !(await btn.isEnabled())) continue
  await btn.click()
  await page.waitForTimeout(850)
  if (await page.locator('.you-died').isVisible().catch(() => false)) break
}

await page.waitForSelector('#scroll-player-name', { timeout: 10000 })
await page.fill('#scroll-player-name', 'TestRunner')
await page.getByRole('button', { name: /Save score/i }).click()
await page.waitForSelector('.climb-home')
const youRow = await page.locator('.scroll-board-table tr.is-you').innerText()
const afterAvg = await page.locator('.scroll-board-avgs').innerText()

console.log(
  JSON.stringify({ startLabel, boardVisible, boardAvg, youRow, afterAvg }, null, 2),
)
await browser.close()
