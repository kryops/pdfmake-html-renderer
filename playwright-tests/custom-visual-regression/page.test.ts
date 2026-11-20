import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// Named page sizes (case-insensitive) use their own height,
// and content uses the full width of landscape pages.
// The watermark only inherits the font from the defaultStyle (not bold/italics)
const namedSizeLandscape: TDocumentDefinitions = {
  pageSize: 'a5' as any,
  pageOrientation: 'landscape',
  pageMargins: 20,
  defaultStyle: { bold: true, italics: true, characterSpacing: 1 },
  watermark: { text: 'Draft', opacity: 0.2 },
  content: [
    { text: 'Full width block on A5 landscape', background: '#ffe9a8' },
    {
      columns: [
        { text: 'left', background: '#cfc' },
        { text: 'right', background: '#fcc' },
      ],
    },
    { table: { widths: ['*', '*'], body: [['a', 'b']] } },
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 550, h: 340, lineColor: 'red' }],
    },
  ],
}

// defaultStyle also has to apply in fluid mode
const defaultStyle: TDocumentDefinitions = {
  defaultStyle: { fontSize: 24, color: 'red', alignment: 'center' },
  content: ['Default style applies in fluid mode'],
}

test('custom/page-size-landscape', async ({ page }) => {
  await takeSnapshots(namedSizeLandscape, page)
})

test('custom/page-fluid-default-style', async ({ page }) => {
  await takeSnapshots(defaultStyle, page, false, { mode: 'fluid' })
})
