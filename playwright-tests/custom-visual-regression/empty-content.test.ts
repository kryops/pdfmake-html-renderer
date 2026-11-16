import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// pdfmake treats empty values as empty text, and stringifies booleans
const document: TDocumentDefinitions = {
  content: [
    'before',
    {},
    null as any,
    true as any,
    false as any,
    { text: null as any },
    { columns: ['left', {}, 'right'] },
    {
      table: {
        body: [
          [
            'null cell',
            null as any,
            { text: 'colSpan 2', colSpan: 2 },
            null as any,
          ],
          [1, 2, 3, 4],
        ],
      },
    },
    { ul: ['a', {}, 'c'] },
    'after',
  ],
}

test('custom/empty-content', async ({ page }) => {
  await takeSnapshots(document, page)
})
