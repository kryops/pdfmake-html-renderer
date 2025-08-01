import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  header: 'Header',
  content: 'Content',
  footer: (currentPage, pageCount) => ({
    text: `${currentPage}/${pageCount}`,
    alignment: 'right',
  }),
  pageMargins: [100, 100],
  pageSize: 'A6',
}

test('custom/page-header-footer', async ({ page }) => {
  await takeSnapshots(document, page)
})
