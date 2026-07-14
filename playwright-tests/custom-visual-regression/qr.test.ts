import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [{ qr: 'foobar' }],
  background: function () {
    return {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 595.28,
          h: 841.89,
          color: '#00BFFF',
        },
      ],
    }
  },
}

test('custom/qr', async ({ page }) => {
  await takeSnapshots(document, page)
})
