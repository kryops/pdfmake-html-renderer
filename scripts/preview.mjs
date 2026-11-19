#!/usr/bin/env node
// Renders a pdfmake document definition with the standalone build (dist/standalone.mjs)
// and saves a full-page screenshot, for quickly checking the rendering of arbitrary content.
//
// Usage: node scripts/preview.mjs <doc.json|doc.mjs> [out.png] [--mode=natural]
//   <doc.mjs> must `export default` the document definition.
// Requires `yarn build` and a local Playwright Chromium (`yarn playwright install chromium`).
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const flags = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => a.slice(2).split('='))
)
const [input, output = 'preview.png'] = args.filter(a => !a.startsWith('--'))
if (!input) {
  console.error(
    'Usage: node scripts/preview.mjs <doc.json|doc.mjs> [out.png] [--mode=natural]'
  )
  process.exit(1)
}

const root = path.join(import.meta.dirname, '..', 'dist')
const abs = path.resolve(input)
const document = abs.endsWith('.json')
  ? JSON.parse(fs.readFileSync(abs, 'utf8'))
  : (await import(pathToFileURL(abs).href)).default

const html = `<!DOCTYPE html><html><head><meta charset="utf-8" />
<link rel="stylesheet" href="/index.css" /></head>
<body><div id="main"></div>
<script type="module">
import { PdfmakeHtmlRenderer, mount } from '/index.mjs'
mount(PdfmakeHtmlRenderer, { target: document.getElementById('main'), props: {
  document: ${JSON.stringify(document)}, pageShadow: false, mode: ${JSON.stringify(flags.mode ?? 'shrinkToFit')} } })
</script></body></html>`

const server = http.createServer((req, res) => {
  const files = {
    '/index.mjs': ['standalone.mjs', 'application/javascript'],
    '/index.css': ['index.css', 'text/css'],
  }
  const f = files[req.url]
  res.setHeader('Content-Type', f ? f[1] : 'text/html')
  res.end(f ? fs.readFileSync(path.join(root, f[0])) : html)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))

const browser = await chromium.launch()
const page = await browser.newPage()
page.on('console', m => console.log('[browser]', m.text()))
page.on('pageerror', e => console.error('[pageerror]', e.message))
await page.goto(`http://127.0.0.1:${server.address().port}`)
await page.waitForTimeout(500)
await page.screenshot({ path: output, fullPage: true })
console.log('Saved', path.resolve(output))
await browser.close()
server.close()
