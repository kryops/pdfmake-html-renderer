import fs from 'fs'
import http from 'http'
import path from 'path'
import getPort from 'get-port'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

// @ts-ignore
import { PdfmakeHtmlRenderer } from '../dist/server'

expect.extend({ toMatchImageSnapshot })

const js = fs.readFileSync(path.join(__dirname, '../dist/global.js'), 'utf8')
const css = fs.readFileSync(path.join(__dirname, '../dist/index.css'), 'utf8')

const response = {
  mimeType: 'text/html',
  content: '',
}

let port: number

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', response.mimeType)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.end(response.content)
})

beforeAll(async () => {
  port = await getPort()
  await new Promise<void>(resolve =>
    server.listen(port, '127.0.0.1', () => resolve())
  )
})

afterAll(() => {
  server.close()
})

async function takeScreenshot() {
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:' + port)
  await new Promise(resolve => setTimeout(resolve, 1000))
  const screenshot = await page.screenshot({
    fullPage: true,
  })
  await page.close()
  return screenshot
}

// via https://gist.github.com/cowboy/3749767
const stringify = function (obj: object): string {
  const placeholder = '____PLACEHOLDER____'
  const fns: any[] = []
  let json = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === 'function') {
        fns.push(value)
        return placeholder
      }
      return value
    },
    2
  )
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift()
  })
  return json
}

export async function imageSnapshot(
  document: TDocumentDefinitions
): Promise<void> {
  response.mimeType = 'text/html'
  response.content = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
      ${css}
    </style>
  </head>
  <body>
    <div id="main"></div>
    <script>
      ${js}
    </script>
    <script>
      new pdfmakeHtmlRenderer.PdfmakeHtmlRenderer({
        target: document.getElementById('main'),
        props: {
          document: ${stringify(document)},
          pageShadow: false,
        }
      })
    </script>
  </body>
  </html>`

  const screenshot = await takeScreenshot()
  expect(screenshot).toMatchImageSnapshot()
}

export async function serverImageSnapshot(
  document: TDocumentDefinitions
): Promise<void> {
  const { html, css } = PdfmakeHtmlRenderer.render({
    document,
    pageShadow: false,
  })

  response.mimeType = 'text/html'
  response.content = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
      ${css.code}
    </style>
  </head>
  <body>
    <div id="main">${html}</div>
  </body>
  </html>`

  const screenshot = await takeScreenshot()
  expect(screenshot).toMatchImageSnapshot()
}

export function performDocumentSnapshotTests(document: TDocumentDefinitions) {
  it('matches snapshot', async () => {
    await imageSnapshot(document)
  })

  // TODO reactivate
  it.skip('matches server snapshot', async () => {
    await serverImageSnapshot(document)
  })
}
