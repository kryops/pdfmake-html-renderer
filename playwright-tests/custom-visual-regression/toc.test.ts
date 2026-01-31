import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    { toc: { title: 'ToC', id: 'empty', hideEmpty: true } },
    '(no ToC above)',
    { toc: { title: 'ToC sorted by title', sortBy: 'title' } },
    { text: 'BBB', tocItem: true },
    { text: 'AAA', tocItem: true },
  ],
}

test('custom/toc', async ({ page }) => {
  await takeSnapshots(document, page)
})
