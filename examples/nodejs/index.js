const http = require('http');

const { PdfmakeHtmlRenderer } = require('../../dist/server')

const hostname = '127.0.0.1';
const port = 3000;

const { html, css } = PdfmakeHtmlRenderer.render({
	document: {
    content: [
      {
        text: 'pdfmake-html-renderer NodeJS Example',
        fontSize: 18,
        bold: true
      },
      '\n',
      'Hello, world!',
      { qr: 'sdfdsf' }
    ]
  }
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>pdfmake-html-renderer NodeJS example</title>
    <style>${css.code}</style>
  </head>
  
  <body>
    <div>${html}</div>
  </body>
  </html>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});