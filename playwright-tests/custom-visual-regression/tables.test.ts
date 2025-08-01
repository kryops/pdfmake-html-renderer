import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    {
      table: {
        widths: [50, 50],
        body: [
          ['One', 'Two'],
          // incomplete borderColor does not override v/hLineColor
          [{ text: 'Three', borderColor: ['yellow'] }, 'Four'],
          [{ text: 'Overflowing Text', noWrap: true }, {}],
        ],
      },
      layout: {
        vLineColor: 'red',
        hLineWidth: () => null, // == 0
        vLineWidth: () => null, // != 0
        paddingLeft: () => null, // == 0
      },
    },
  ],
}

test('custom/tables', async ({ page }) => {
  await takeSnapshots(document, page)
})
