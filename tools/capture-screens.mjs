// Capture Perf Lab UI screenshots for the deck.
// Usage: node tools/capture-screens.mjs [baseUrl] [shotName]   (Perf Lab must be running, default :5280)
import { chromium } from 'playwright-chromium'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:5280'
const OUT = new URL('../public/screens/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

// GitLab Pages build (node tools/build-pages.mjs in gaap-perf-lab, served locally) — the live site needs GitLab SSO
const PAGES = process.env.PAGES_URL || 'http://127.0.0.1:5391'
const PAGES_RUN = '20261117-092927_apis-gaap-api-POST-v1-banword-check-happy'
const RUN_OK = '20261117-092927_apis-gaap-api-POST-v1-banword-check-happy'
const NS_FAIL = '20261117-110520_apis-notification-api-PUT-gaap-v1-my-notificatio'
const NS_1M = '20261117-161345_apis-notification-api-PUT-gaap-v1-my-notificatio'
const NS_TC01 = 'scripts/apis/notification-api/PUT__gaap-v1-my-notification-settings__TC01_first-write.js'
const NS_10M = '20261117-172855_apis-notification-api-PUT-gaap-v1-my-notificatio'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------- page helpers ----------

/** Open the AI dock for the PUT notification-settings row and widen it. */
async function openDesignerDock(page) {
  const row = page.locator('tbody tr', { hasText: '/gaap/v1/my/notification-settings' }).filter({ hasText: 'PUT' }).first()
  await row.getByRole('button', { name: 'AI', exact: true }).click()
  await page.waitForSelector('aside.ai-dock')
  await widenDock(page)
}

async function widenDock(page, width = 640) {
  await page.addStyleTag({ content: `aside.ai-dock{width:${width}px !important;max-width:none !important}` })
  await sleep(1500)
}

/** Scroll the dock's chat body so the first element containing `text` sits near the top. */
async function scrollDockTo(page, text, offset = 8) {
  await page.evaluate(
    ({ text, offset }) => {
      const body = document.querySelector('aside.ai-dock .ai-body')
      if (!body) return
      const hit = [...body.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().startsWith(text))
      if (!hit) return
      const top = hit.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop
      body.scrollTop = top - offset
    },
    { text, offset },
  )
  await sleep(400)
}

/** Mark endpoint rows: green = has test cases, red dashed = no script yet. */
async function markCoverage(page) {
  await page.evaluate(() => {
    const css = document.createElement('style')
    css.textContent = `
      tr.cov-yes > td:first-child { box-shadow: inset 4px 0 0 #23818a; }
      tr.cov-no  > td:first-child { box-shadow: inset 4px 0 0 #c8423f; }
      tr.cov-yes { background: rgba(35,129,138,.06) !important; }
      .cov-cell-yes { outline: 2px solid #23818a; outline-offset: 3px; border-radius: 8px; }
      tr.cov-yes > td:nth-child(3) { max-width: 400px; overflow: hidden; }
      .cov-cell-no  { outline: 2px dashed #c8423f; outline-offset: 3px; border-radius: 8px; color: #c8423f !important; font-weight: 600; }
    `
    document.head.appendChild(css)
    for (const tr of document.querySelectorAll('tbody tr')) {
      const cells = tr.querySelectorAll(':scope > td')
      if (cells.length < 4) continue // TC sub-rows
      const script = cells[2]
      const none = /No script/.test(script.innerText)
      if (!/^(GET|PUT|POST|DELETE|PATCH)\b/.test(cells[0].innerText.trim())) continue
      tr.classList.add(none ? 'cov-no' : 'cov-yes')
      const target = script.firstElementChild || script
      target.classList.add(none ? 'cov-cell-no' : 'cov-cell-yes')
    }
  })
}


/** Print element boxes as % of the captured area, for placing slide overlays. */
async function logBoxes(page, name, finders, within) {
  const boxes = await page.evaluate(({ finders, within }) => {
    const root = within ? document.querySelector(within).getBoundingClientRect() : { x: 0, y: 0, width: innerWidth, height: innerHeight }
    const out = {}
    for (const [key, f] of Object.entries(finders)) {
      let el = null
      if (f.css) el = document.querySelector(f.css)
      else if (f.btn) el = [...document.querySelectorAll('button, [role="tab"]')].find((e) => e.innerText.trim() === f.btn)
      else {
        const leaf = [...document.querySelectorAll('body *')].find((e) => e.childElementCount === 0 && e.textContent.trim() === f.text)
        el = leaf
        for (let i = 0; el && i < (f.up || 0); i++) el = el.parentElement
      }
      if (!el) { out[key] = null; continue }
      const r = el.getBoundingClientRect()
      const pct = (v, base) => +(v / base * 100).toFixed(1)
      out[key] = { left: pct(r.x - root.x, root.width), top: pct(r.y - root.y, root.height), width: pct(r.width, root.width), height: pct(r.height, root.height) }
    }
    return out
  }, { finders, within })
  console.log(name, JSON.stringify(boxes))
}


/** Box of the first element whose own text starts with `text`, climbed `up` levels, as % of `within`. */
async function boxOf(page, text, up = 0, within = 'aside.ai-dock') {
  return page.evaluate(({ text, up, within }) => {
    const root = document.querySelector(within).getBoundingClientRect()
    let el = [...document.querySelectorAll(within + ' *')].find((e) => e.childElementCount === 0 && e.textContent.trim().startsWith(text))
    for (let i = 0; el && i < up; i++) el = el.parentElement
    if (!el) return null
    const r = el.getBoundingClientRect()
    const pct = (v, b) => +(v / b * 100).toFixed(1)
    return { left: pct(r.x - root.x, root.width), top: pct(r.y - root.y, root.height), width: pct(r.width, root.width), height: pct(r.height, root.height) }
  }, { text, up, within })
}

/** Rebuild the 10:30 state: the PUT row had no script yet (copy the cells of a row without one). */
async function putRowWithoutScript(page) {
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('tbody tr')].filter((tr) => tr.querySelectorAll(':scope > td').length >= 4)
    const put = rows.find((tr) => /PUT/.test(tr.cells[0].innerText) && /notification-settings/.test(tr.cells[1].innerText))
    const empty = rows.find((tr) => /No script/.test(tr.cells[2].innerText))
    for (const i of [2, 3, 4, tr => tr.cells.length - 1].map((x) => (typeof x === 'function' ? x(put) : x))) put.cells[i].innerHTML = empty.cells[i].innerHTML
    for (const tr of rows) tr.cells[2].style.cssText = 'max-width: 400px; overflow: hidden'
  })
}


/** Hide the sticky top nav so element shots below the fold are not covered by it. */
async function hideStickyNav(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const pos = getComputedStyle(el).position
      if ((pos === 'sticky' || pos === 'fixed') && !el.closest('aside.ai-dock') && el.getBoundingClientRect().top < 10) el.style.visibility = 'hidden'
    }
  })
}

// ---------- shots ----------

const shots = [
  { name: 'infra', path: '/infra' },
  // wider so the AI / Stub / Run action column is not clipped
  { name: 'apis', path: '/apis/gaap-api', viewport: { width: 1360, height: 860 } },
  { name: 'scripts', path: '/scripts' },
  { name: 'runs', path: '/runs' },
  { name: 'run-detail', path: `/runs/${RUN_OK}` },
  // Story run: PUT notification-settings TC01, 1-min pass vs 10-min fail
  { name: 'compare', path: `/runs/compare?ids=${NS_1M},${NS_10M}`, viewport: { width: 1280, height: 820 },
    clip: { x: 20, y: 245, width: 910, height: 490 } },
  // Run dialog opened via "Run again" (dialog only; nothing is submitted)
  { name: 'run-dialog', path: `/runs/${NS_1M}`, click: 'button:has-text("Run again")', viewport: { width: 1180, height: 820 },
    element: '[role="dialog"]' },

  // ----- Infra tab (slide 6) -----
  { name: 'infra-overview', path: '/infra', viewport: { width: 1360, height: 760 }, waitText: 'tcp open',
    prepare: async (page) => {
      await logBoxes(page, 'infra-overview', {
        runtime: { css: '.infra-start-opts' },
        startAll: { btn: 'Start all' },
        infra: { text: 'Click to view docker logs', up: 2 },
        modules: { text: 'Click for logs · ▶ / ■ to start/stop', up: 2 },
        notif: { text: 'notification-api', up: 2 },
      })
    } },
  { name: 'infra-log', path: '/infra', viewport: { width: 1360, height: 760 }, waitText: 'tcp open',
    prepare: async (page) => {
      await page.locator('.svc-cell[title="View notification-api runtime logs"]').click()
      await sleep(2500)
      await logBoxes(page, 'infra-log', { panel: { css: '.log-col' }, config: { btn: 'Config' } })
    } },
  // Docker limits form; values are typed for the picture only, never saved
  { name: 'infra-config', path: '/infra', viewport: { width: 1360, height: 760 }, waitText: 'tcp open',
    prepare: async (page) => {
      await page.locator('.svc-cell[title="View notification-api runtime logs"]').click()
      await sleep(1500)
      await page.getByRole('tab', { name: 'Config' }).click()
      await sleep(800)
      const col = page.locator('.log-col')
      await col.getByPlaceholder('no limit').fill('2')
      await col.getByPlaceholder('e.g. 2g, 512m').fill('2g')
      await sleep(300)
      await logBoxes(page, 'infra-config', {
        cpus: { css: '.log-col input[placeholder="no limit"]' },
        ram: { css: '.log-col input[placeholder="e.g. 2g, 512m"]' },
        restart: { btn: 'Save & restart' },
      }, '.log-col')
    },
    element: '.log-col' },

  // ----- GitLab Pages (slide 12) -----
  { name: 'pages-index', url: `${PAGES}/`, viewport: { width: 1360, height: 860 },
    prepare: async (page) => {
      await logBoxes(page, 'pages-index', {
        badge: { text: 'Published · GitLab Pages' }, tiles: { text: 'APIs tested', up: 2 },
        testers: { css: 'select:nth-of-type(3)' }, by: { text: 'BY', up: 0 },
      })
    } },
  { name: 'pages-run-top', url: `${PAGES}/runs/${PAGES_RUN}/`, viewport: { width: 1360, height: 860 },
    prepare: async (page) => {
      await logBoxes(page, 'pages-run-top', { report: { text: 'Report k6' }, metrics: { text: 'Requests', up: 2 } })
    } },
  { name: 'pages-run-full', url: `${PAGES}/runs/${PAGES_RUN}/`, viewport: { width: 1360, height: 860 },
    prepare: async (page, s) => {
      const h = await page.evaluate(() => document.body.scrollHeight)
      console.log('pages-run-full height', h)
      s.full = true
    } },
  { name: 'pages-report', url: `${PAGES}/runs/${PAGES_RUN}/report.html`, viewport: { width: 1360, height: 860 },
    prepare: async () => { await sleep(1500) } },
  // ----- Run report (slide 11) -----
  { name: 'run-context', path: `/runs/${NS_1M}`, viewport: { width: 1280, height: 900 }, waitText: 'Basic information',
    prepare: async (page) => {
      await page.locator('section.card:has-text("Basic information")').scrollIntoViewIfNeeded()
      await page.locator('section.card:has-text("Basic information")').evaluate((el) => { el.dataset.cap = 'ctx' })
      await hideStickyNav(page)
      await logBoxes(page, 'run-context', {
        infra: { text: 'INFRA', up: 2 }, tomcat: { text: 'TOMCAT THREAD POOL', up: 2 }, mongo: { text: 'MONGODB CONNECTION POOL', up: 2 },
      }, '[data-cap="ctx"]')
    },
    element: 'section.card:has-text("Basic information")' },
  { name: 'run-flags', path: `/runs/${NS_1M}`, viewport: { width: 1280, height: 900 }, waitText: 'Feature flags',
    prepare: async (page, s) => {
      const th = page.locator('section.card:has-text("Thresholds")').first()
      await th.evaluate((el) => el.scrollIntoView({ block: 'start' }))
      await page.evaluate(() => window.scrollBy(0, -16))
      await hideStickyNav(page)
      await sleep(300)
      const a = await th.boundingBox()
      const b = await page.locator('section.card:has-text("Feature flags")').first().boundingBox()
      s.clip = { x: a.x - 8, y: a.y - 8, width: a.width + 16, height: b.y + b.height - a.y + 16 }
    } },
  { name: 'grafana-shot', path: `/runs/${NS_1M}`, viewport: { width: 1280, height: 900 }, waitText: 'Grafana screenshots',
    prepare: async (page) => {
      const card = page.locator('section.card:has-text("Grafana screenshots")').first()
      await card.scrollIntoViewIfNeeded()
      await card.evaluate((el) => { el.dataset.cap = 'graf' })
      await sleep(1500)
      await hideStickyNav(page)
      await logBoxes(page, 'grafana-shot', { window: { text: 'notification-api · 2026-11-17T09:13:17.955Z → 2026-11-17T09:15:48.812Z', up: 0 }, full: { text: 'Open full size', up: 0 } },
        '[data-cap="graf"]')
    },
    element: 'section.card:has-text("Grafana screenshots")' },
  { name: 'run-grafana-btn', path: `/runs/${NS_1M}`, viewport: { width: 1280, height: 800 }, waitText: 'Requests',
    prepare: async (page) => {
      await logBoxes(page, 'run-grafana-btn', { grafana: { css: 'a[href*="13000"]' }, metrics: { text: 'Requests', up: 3 } })
    },
    clip: { x: 0, y: 60, width: 1280, height: 520 } },
  // Grafana itself, opened from the run's Grafana link (same job + time window)
  { name: 'grafana-live', url: 'http://127.0.0.1:13000/d/localperf-api/local-perf-api-metrics?orgId=1&from=1794906797955&to=1794906948812&var-job=notification-api&var-biz=%24__all&refresh=',
    viewport: { width: 1360, height: 760 },
    prepare: async (page) => {
      await sleep(8000)
      await logBoxes(page, 'grafana-live', { picker: { btn: '2026-11-17 16:13:17 to 2026-11-17 16:15:48' }, job: { text: 'job', up: 1 } })
    } },
  // ----- AI fixes failures (slide 10) -----
  { name: 'fail-top', path: `/runs/${NS_FAIL}`, viewport: { width: 1360, height: 760 }, waitText: 'k6 exited',
    prepare: async (page) => {
      await logBoxes(page, 'fail-top', { banner: { text: 'k6 exited 108', up: 1 }, error: { text: 'Error', up: 1 }, triage: { btn: 'AI triage' } })
    } },
  { name: 'triage-fix', path: `/runs/${NS_FAIL}`, viewport: { width: 1500, height: 680 },
    prepare: async (page) => {
      await page.locator('button', { hasText: 'AI triage' }).first().click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'Fix', 6)
      await hideStickyNav(page)
      console.log('triage-fix', JSON.stringify({ fix: await boxOf(page, 'Fix', 0), quick: await boxOf(page, 'Nhanh', 0), stable: await boxOf(page, 'Ổn định', 0) }))
    },
    element: 'aside.ai-dock' },
  { name: 'triage-done', path: `/runs/${NS_FAIL}`, viewport: { width: 1500, height: 680 },
    prepare: async (page) => {
      await page.locator('button', { hasText: 'AI triage' }).first().click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'Ổn định theo convention', 150)
      await hideStickyNav(page)
      console.log('triage-done', JSON.stringify({ reply: await boxOf(page, 'Ổn định theo convention', 1), done: await boxOf(page, 'Đã làm', 0), verify: await boxOf(page, 'Verify', 0) }))
    },
    element: 'aside.ai-dock' },
  { name: 'rerun-top', path: '/runs/20261117-111203_apis-notification-api-PUT-gaap-v1-my-notificatio', viewport: { width: 1360, height: 760 }, waitText: 'Requests',
    prepare: async (page) => {
      await logBoxes(page, 'rerun-top', { metrics: { text: 'Requests', up: 3 } })
    } },
  { name: 'infra-cd', path: '/infra', viewport: { width: 1360, height: 760 }, waitText: 'tcp open',
    prepare: async (page) => {
      await page.locator('.svc-cell', { hasText: 'Central Dogma' }).first().click()
      await sleep(2500)
      await logBoxes(page, 'infra-cd', { cd: { css: '.svc-cell[data-health]:not([data-health="up"])' }, analyze: { btn: 'AI analyze' }, panel: { css: '.log-col' } })
    } },
  { name: 'infra-ai-cause', path: '/infra', viewport: { width: 1500, height: 680 }, waitText: 'tcp open',
    prepare: async (page) => {
      await page.locator('.svc-cell', { hasText: 'Central Dogma' }).first().click()
      await sleep(1500)
      await page.getByRole('button', { name: 'AI analyze' }).first().click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'Cause', 6)
      await hideStickyNav(page)
      console.log('infra-ai-cause', JSON.stringify({ cause: await boxOf(page, 'Cause', 1) }))
    },
    element: 'aside.ai-dock' },
  { name: 'infra-ai-done', path: '/infra', viewport: { width: 1500, height: 680 }, waitText: 'tcp open',
    prepare: async (page) => {
      await page.locator('.svc-cell', { hasText: 'Central Dogma' }).first().click()
      await sleep(1500)
      await page.getByRole('button', { name: 'AI analyze' }).first().click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'minimal', 10)
      await hideStickyNav(page)
      console.log('infra-ai-done', JSON.stringify({ pick: await boxOf(page, 'minimal', 1), healthy: await boxOf(page, 'Xong rồi', 1) }))
    },
    element: 'aside.ai-dock' },
  // ----- Script review (slide 9) -----
  { name: 'script-head', path: `/scripts/view?path=${NS_TC01}`, viewport: { width: 1360, height: 760 }, waitText: 'Sequence diagram',
    prepare: async (page) => {
      await logBoxes(page, 'script-head', {
        seq: { css: 'section.card' }, explain: { btn: 'AI explain' }, run: { btn: 'Run' }, tags: { css: '.phead-row' },
      })
    } },
  { name: 'script-seq', path: `/scripts/view?path=${NS_TC01}`, viewport: { width: 1360, height: 760 }, waitText: 'Sequence diagram',
    prepare: async (page) => {
      await page.locator('.mermaid-block').scrollIntoViewIfNeeded()
      await hideStickyNav(page)
    },
    element: '.mermaid-block' },
  { name: 'script-code', path: `/scripts/view?path=${NS_TC01}`, viewport: { width: 1360, height: 760 }, waitText: 'Sequence diagram',
    prepare: async (page) => {
      await page.locator('.script-editor').scrollIntoViewIfNeeded()
      await sleep(600)
      const box = async (t) => page.evaluate((t) => {
        const root = document.querySelector('.script-editor').getBoundingClientRect()
        const line = [...document.querySelectorAll('.script-editor .cm-line')].find((l) => l.textContent.includes(t))
        if (!line) return null
        const r = line.getBoundingClientRect()
        const pct = (v, b) => +(v / b * 100).toFixed(1)
        return { left: pct(r.x - root.x, root.width), top: pct(r.y - root.y, root.height), width: pct(r.width, root.width), height: pct(r.height, root.height) }
      }, t)
      console.log('script-code', JSON.stringify({ source: await box('@source'), endpoint: await box('@endpoint'), cs: await box('@case') }))
    },
    element: '.script-editor' },
  { name: 'script-explain', path: `/scripts/view?path=${NS_TC01}`, viewport: { width: 1500, height: 680 }, waitText: 'Sequence diagram',
    prepare: async (page) => {
      await page.locator('button', { hasText: 'AI explain' }).click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'check xem script này có ramp up chưa', 14)
      console.log('script-explain', JSON.stringify({
        ask: await boxOf(page, 'check xem script này có ramp up chưa', 1),
        answer: await boxOf(page, 'Không có ramp-up', 1),
      }))
    },
    element: 'aside.ai-dock' },
  // Run dialog from the script page (opened only; nothing is submitted)
  { name: 'script-run', path: `/scripts/view?path=${NS_TC01}`, viewport: { width: 1360, height: 760 }, waitText: 'Sequence diagram',
    prepare: async (page) => {
      await page.getByRole('button', { name: 'Run', exact: true }).first().click()
      await page.waitForSelector('[role="dialog"]')
      await sleep(1200)
      await logBoxes(page, 'script-run', { dialog: { css: '[role="dialog"]' } })
    } },
  // ----- AI test designer (slide 8) -----
  { name: 'designer-list', path: '/apis/notification-api', viewport: { width: 1360, height: 640 }, waitText: '4 test cases',
    prepare: async (page) => {
      await putRowWithoutScript(page)
      await sleep(300)
      await logBoxes(page, 'designer-list', {
        putRow: { css: 'tbody tr:nth-child(2)' },
        putAi: { css: 'tbody tr:nth-child(2) td:last-child button' },
      }, '.api-layout')
    },
    element: '.api-layout' },
  { name: 'designer-prompt', path: '/apis/notification-api', viewport: { width: 1500, height: 680 }, waitText: '4 test cases',
    prepare: async (page) => {
      await openDesignerDock(page)
      await scrollDockTo(page, 'Đọc code PUT /gaap/v1/my/notification-settings rồi đề xuất test case (happy, và', 14)
      console.log('designer-prompt', JSON.stringify({
        prompt: await boxOf(page, 'Đọc code PUT /gaap/v1/my/notification-settings rồi đề xuất test case (happy, và', 1),
        tools: await boxOf(page, 'Used 39 tools', 1),
      }))
    },
    element: 'aside.ai-dock' },
  { name: 'designer-cases', path: '/apis/notification-api', viewport: { width: 1500, height: 680 }, waitText: '4 test cases',
    prepare: async (page) => {
      await openDesignerDock(page)
      await scrollDockTo(page, 'Case đề xuất', 8)
      console.log('designer-cases', JSON.stringify({ heading: await boxOf(page, 'Case đề xuất'), data: await boxOf(page, 'Test data') }))
    },
    element: 'aside.ai-dock' },
  { name: 'plan-data', path: '/apis/notification-api', viewport: { width: 1500, height: 680 }, waitText: '4 test cases',
    prepare: async (page) => {
      await openDesignerDock(page)
      await page.locator('aside.ai-dock .ai-tabs button', { hasText: 'Plan' }).click()
      await sleep(800)
      await scrollDockTo(page, 'Test data', 6)
      console.log('plan-data', JSON.stringify({ heading: await boxOf(page, 'Test data'), written: await boxOf(page, 'Script written', 1) }))
    },
    element: 'aside.ai-dock' },

  // ----- product tour (slides 6+) -----
  // Settings: the repo the stack is started from
  { name: 'settings-repo', path: '/settings', viewport: { width: 760, height: 760 },
    element: 'section.card:has-text("Stack name")' },
  // APIs catalog: one tile per service module, endpoint count from OpenAPI
  { name: 'apis-catalog', path: '/apis', viewport: { width: 1180, height: 600 }, waitText: 'endpoints',
    element: 'main' },
  // One module: which endpoints already have test cases (annotated)
  { name: 'apis-coverage', path: '/apis/notification-api', viewport: { width: 1360, height: 900 }, waitText: '4 test cases',
    prepare: async (page) => {
      await page.getByText('4 test cases', { exact: true }).click()
      await sleep(800)
      await markCoverage(page)
    },
    element: '.api-layout' },
  // AI test designer: chat after reading the code (flow + proposed cases)
  { name: 'ai-designer', path: '/apis/notification-api', viewport: { width: 1500, height: 680 }, waitText: '4 test cases',
    prepare: async (page) => {
      await openDesignerDock(page)
      await scrollDockTo(page, 'Flow (đã đọc code)', 10)
    },
    element: 'aside.ai-dock' },
  // AI test designer: Plan tab, the chosen cases with Given / When / Then
  { name: 'ai-plan', path: '/apis/notification-api', viewport: { width: 1500, height: 680 }, waitText: '4 test cases',
    prepare: async (page) => {
      await openDesignerDock(page)
      await page.locator('aside.ai-dock .ai-tabs button', { hasText: 'Plan' }).click()
      await sleep(800)
      await scrollDockTo(page, 'Test cases', 6)
    },
    element: 'aside.ai-dock' },
  // Failed run + AI triage dock
  { name: 'triage', path: `/runs/${NS_FAIL}`, viewport: { width: 1500, height: 680 },
    prepare: async (page) => {
      await page.locator('button', { hasText: 'AI triage' }).first().click()
      await page.waitForSelector('aside.ai-dock')
      await widenDock(page)
      await scrollDockTo(page, 'Cause', 2)
      // the sticky top nav would overlap the dock once the page has scrolled
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('body *')) {
          const pos = getComputedStyle(el).position
          if ((pos === 'sticky' || pos === 'fixed') && !el.closest('aside.ai-dock') && el.getBoundingClientRect().top < 10) el.style.visibility = 'hidden'
        }
      })
    },
    element: 'aside.ai-dock' },
  // Passing run report: header, context chips and headline metrics
  { name: 'run-report', path: `/runs/${NS_1M}`, viewport: { width: 1280, height: 800 },
    clip: { x: 0, y: 60, width: 1280, height: 520 } },
]

const browser = await chromium.launch({ channel: 'chromium' })
const page = await browser.newPage({ viewport: { width: 1180, height: 760 }, deviceScaleFactor: 2 })
await page.addInitScript(() => {
  try {
    localStorage.setItem('perf-test:locale', 'en')
    localStorage.setItem('perf-test:theme', 'light')
  } catch {}
})

for (const s of shots.filter((s) => !process.argv[3] || s.name === process.argv[3])) {
  await page.setViewportSize(s.viewport || { width: 1180, height: 760 })
  await page.goto(s.url || BASE + s.path, { waitUntil: s.url ? 'load' : 'networkidle' })
  if (s.waitText) await page.getByText(s.waitText).first().waitFor({ timeout: 20000 })
  await sleep(1500)
  if (s.click) {
    await page.click(s.click)
    await sleep(1200)
  }
  if (s.prepare) await s.prepare(page, s)
  const path = `${OUT}${s.name}.png`
  if (s.element) await page.locator(s.element).first().screenshot({ path })
  else await page.screenshot({ path, clip: s.clip, fullPage: !!s.full })
  console.log('saved', s.name)
}

await browser.close()
