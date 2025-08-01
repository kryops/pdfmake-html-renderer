import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// https://github.com/bpampuch/pdfmake/blob/master/examples/basics.js
const document: TDocumentDefinitions = {
  content: [
    'First paragraph',
    'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
  ],
}

test('pdfmake/basics', async ({ page }) => {
  await takeSnapshots(document, page)
})
