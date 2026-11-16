import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const longText =
  'lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore'

const document: TDocumentDefinitions = {
  content: [
    'Star columns have the same width',
    { columns: ['short', longText, 'mid text'] },
    ' ',
    'Fixed and star columns with a gap',
    {
      columns: [{ width: 100, text: 'fixed' }, 'star', 'star'],
      columnGap: 20,
    },
    ' ',
    'Percentages are relative to the space without gaps',
    {
      columns: [{ width: '25%', text: 'quarter' }, 'star', 'star'],
      columnGap: 20,
    },
    {
      columns: [
        { width: '50%', text: 'half' },
        { width: '50%', text: 'half' },
      ],
      columnGap: 30,
    },
    ' ',
    'Auto columns with long text leave some space for star columns',
    { columns: [{ width: 'auto', text: longText + longText }, 'star a', 'b'] },
  ],
}

test('custom/columns', async ({ page }) => {
  await takeSnapshots(document, page)
})
