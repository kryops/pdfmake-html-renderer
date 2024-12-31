import { createServer } from 'node:http'
import { render } from 'svelte/server'
import PdfmakeHtmlRenderer from 'pdfmake-html-renderer/server'

const hostname = '127.0.0.1'
const port = 3000

const { body, head } = render(PdfmakeHtmlRenderer, {
  props: {
    document: {
      content: [
        {
          text: 'pdfmake-html-renderer NodeJS Example',
          fontSize: 18,
          bold: true,
        },
        '\n',
        'Hello, world!',
      ],
    },
  },
})

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(`<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pdfmake-html-renderer NodeJS example</title>
    ${head}
  </head>
  
  <body>
    <div>${body}</div>
  </body>
  </html>`)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
