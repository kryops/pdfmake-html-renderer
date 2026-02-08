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
          [{ text: 'Three', borderColor: ['yellow'] as any }, 'Four'],
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
    ' ',
    {
      table: {
        heights: 40,
        body: [
          [{ text: 'top', verticalAlignment: 'top' }, 'column B'],
          [{ text: 'middle', verticalAlignment: 'middle' }, 'column B'],
          [{ text: 'bottom', verticalAlignment: 'bottom' }, 'column B'],
        ],
      },
    },
  ],
}

test('custom/tables', async ({ page }) => {
  await takeSnapshots(document, page)
})
