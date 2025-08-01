import fs from 'fs'
import http from 'http'
import path from 'path'
import getPort from 'get-port'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { expect, test, type Page } from '@playwright/test'

// @ts-ignore
import { PdfmakeHtmlRenderer } from '../dist/server'

const js = fs.readFileSync(
  path.join(import.meta.dirname, '../dist/global.js'),
  'utf8'
)
const css = fs.readFileSync(
  path.join(import.meta.dirname, '../dist/index.css'),
  'utf8'
)

const response = { mimeType: 'text/html', content: '' }

let port: number

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', response.mimeType)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.end(response.content)
})

// NOTE: This is executed once for each worker, not per test suite.
// Cannot close in afterAll, as this would be called too early
test.beforeAll(async () => {
  port = await getPort()
  await new Promise<void>(resolve => server.listen(port, resolve))
})

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
  document: TDocumentDefinitions,
  page: Page
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

  await page.goto('http://127.0.0.1:' + port)
  await expect(page).toHaveScreenshot({ fullPage: true })
}

export async function serverImageSnapshot(
  document: TDocumentDefinitions,
  page: Page
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

  await page.goto('http://127.0.0.1:' + port)
  await expect(page).toHaveScreenshot({ fullPage: true })
}

export async function takeSnapshots(
  document: TDocumentDefinitions,
  page: Page
): Promise<void> {
  await imageSnapshot(document, page)
  await serverImageSnapshot(document, page)
}
