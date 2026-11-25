import { chromium } from 'playwright'

const mediaDir =
  'C:/Users/Clinton/AppData/Local/Cursor/AgentStores/cursor_agent_stores/bc-fb43bf1f-5c4c-45f5-81ed-242261e04de8/files/media'

const browser = await chromium.launch({ headless: true })

async function check(width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Start the Climb' }).click()
  await page.waitForSelector('.keyboard')
  // Wait out stage-in so transforms settle
  await page.waitForTimeout(600)
  const info = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const b = el.getBoundingClientRect()
      return {
        left: Math.round(b.left),
        right: Math.round(b.right),
        width: Math.round(b.width),
      }
    }
    return {
      banner: !!document.querySelector('.ladder-goal'),
      bannerText: [...document.querySelectorAll('p')].some((p) =>
        /Clear each listing/.test(p.textContent || ''),
      ),
      active: box('.ladder-rung-active'),
      media: box('.pdp-media'),
      buybox: box('.pdp-buybox'),
      keyboard: box('.keyboard'),
      locked: box('.ladder-rung-locked'),
      pdp: box('.pdp'),
    }
  })
  await page.screenshot({
    path: `${mediaDir}/hangazon-align-${width}.png`,
    fullPage: true,
  })
  await page.close()
  return info
}

const mobile = await check(390, 844)
const desk = await check(1280, 900)
console.log(JSON.stringify({ mobile, desk }, null, 2))

function assertAlign(label, info) {
  if (info.banner || info.bannerText) {
    throw new Error(`${label}: banner still present`)
  }
  const L = info.active.left
  const R = info.active.right
  if (
    Math.abs(info.locked.left - L) > 1 ||
    Math.abs(info.locked.right - R) > 1
  ) {
    throw new Error(
      `${label}: locked vs active edge mismatch ${JSON.stringify({ L, R, locked: info.locked })}`,
    )
  }
  if (info.media.left < L - 1) throw new Error(`${label}: media left outside`)
  if (info.buybox && info.buybox.right > R + 1) {
    throw new Error(`${label}: buybox right outside`)
  }
  // Stacked only: media + keyboard share the same content left edge
  if (info.media.left === info.keyboard.left || info.pdp.width < 700) {
    if (Math.abs(info.media.left - info.keyboard.left) > 1) {
      throw new Error(
        `${label}: media/keyboard left mismatch ${JSON.stringify({
          media: info.media,
          keyboard: info.keyboard,
        })}`,
      )
    }
  }
  // Shared rail: PDP content outer edges (media left … buybox right) match padding inset
  const contentLeft = info.media.left
  const contentRight = info.buybox.right
  const pad = contentLeft - L
  if (Math.abs(R - contentRight - pad) > 2) {
    throw new Error(
      `${label}: content rail not symmetric ${JSON.stringify({
        L,
        R,
        contentLeft,
        contentRight,
        pad,
      })}`,
    )
  }
  console.log(`${label} PASS`)
}

assertAlign('mobile', mobile)
assertAlign('desk', desk)
await browser.close()
