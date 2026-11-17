import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Canvas',
    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 100,
          h: 60,
          color: ['stripe45d', 'red'],
        },
        {
          type: 'ellipse',
          x: 170,
          y: 30,
          r1: 40,
          r2: 30,
          color: ['stripe45d', 'blue'],
          fillOpacity: 0.5,
          lineColor: 'black',
        },
        {
          type: 'rect',
          x: 230,
          y: 0,
          w: 100,
          h: 60,
          color: ['checker', 'black'],
        },
      ],
    },
    { text: 'Table', margin: [0, 10, 0, 0] },
    {
      table: {
        body: [
          [
            {
              text: 'Overlay',
              fillColor: 'blue',
              fillOpacity: 0.3,
              overlayPattern: ['stripe45d', 'gray'],
              overlayOpacity: 0.5,
            },
            { text: 'Fill', fillColor: ['stripe45d', 'green'] },
          ],
        ],
      },
    },
  ],
  patterns: {
    stripe45d: {
      boundingBox: [1, 1, 4, 4],
      xStep: 3,
      yStep: 3,
      pattern: '1 w 0 1 m 4 5 l s 2 0 m 5 3 l s',
    },
    checker: {
      boundingBox: [0, 0, 10, 10],
      xStep: 10,
      yStep: 10,
      pattern: '0 0 5 5 re f 5 5 5 5 re f',
    },
  },
}

test('custom/patterns', async ({ page }) => {
  await takeSnapshots(document, page)
})
