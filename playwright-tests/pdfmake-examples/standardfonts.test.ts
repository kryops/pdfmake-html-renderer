import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// https://github.com/bpampuch/pdfmake/blob/master/examples/standardfonts.js
const document: TDocumentDefinitions = {
  content: [
    {
      text: 'Standard fonts supports only ANSI code page (only english characters)!',
      bold: true,
    },
    ' ',
    { text: 'Courier font', font: 'Courier' },
    { text: 'Helvetica font', font: 'Helvetica' },
    { text: 'Times font', font: 'Times' },
    //{ text: 'Symbol font', font: 'Symbol' },
    //{ text: 'ZapfDingbats font', font: 'ZapfDingbats' },
  ],
  defaultStyle: { font: 'Helvetica' },
}

test('pdfmake/standardfonts', async ({ page }) => {
  await takeSnapshots(document, page)
})
