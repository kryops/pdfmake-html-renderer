import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  header: 'Header',
  content: [
    'Content',
    // section margins determine the height of header and footer
    {
      section: [{ text: 'Number margins (60pt)' }],
      pageMargins: 60,
      header: { text: 'Header (60pt)', background: '#fcc' },
      footer: { text: 'Footer (60pt)', background: '#cfc' },
    },
    {
      section: [{ text: '[left, top, right, bottom] margins' }],
      pageMargins: [10, 30, 10, 70],
      header: { text: 'Header (30pt)', background: '#fcc' },
      footer: { text: 'Footer (70pt)', background: '#cfc' },
    },
  ],
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
