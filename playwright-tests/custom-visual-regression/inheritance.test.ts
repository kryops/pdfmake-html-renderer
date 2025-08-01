import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Inheritance\n\n',
    { text: 'leadingIndent', leadingIndent: 10 },
    {
      stack: [
        { text: 'leadingIndent in a stack' },
        { text: 'again', leadingIndent: 10 },
      ],
      leadingIndent: 10,
    },
    {
      table: {
        body: [
          [
            'Table with fillColor and fillOpacity',
            { table: { body: [['Nested Table']] } },
          ],
        ],
      },
      fillColor: 'red',
      fillOpacity: 0.5,
    },
    {
      columns: [
        'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
        [
          'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
          {
            columns: [
              'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
              'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
            ],
          },
        ],
      ],
      columnGap: 20,
    },
  ],
}

test('custom/inheritance', async ({ page }) => {
  await takeSnapshots(document, page)
})
