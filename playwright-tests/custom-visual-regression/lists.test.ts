import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Reversed with nested lists: 3, 2, 1',
    { ol: ['a', 'b', { ul: ['nested 1', 'nested 2'] }, 'c'], reversed: true },
    'Reversed with nested ordered list: 2, 1',
    { ol: ['a', { ol: ['nested 1', 'nested 2'] }, 'b'], reversed: true },
    'Reversed with start: 5, 4, 3',
    { ol: ['a', 'b', { ul: ['nested'] }, 'c'], reversed: true, start: 5 },
  ],
}

test('custom/lists-reversed-nested', async ({ page }) => {
  await takeSnapshots(document, page)
})
