import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  pageMargins: 40,
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
    {
      pageMargins: 20,
      section: ['Section spacing inheritance', 'This section sets margin 20.'],
    },
    {
      pageMargins: 'inherit',
      section: [
        'Second section inherits previous section margins',
        'This should match the previous section instead of the document default.',
      ],
    },
    {
      pageMargins: 10,
      section: [
        'Third section with 10pt margins',
        'The explicit section margin is smaller again.',
      ],
    },
  ],
}

test('custom/inheritance', async ({ page }) => {
  await takeSnapshots(document, page)
})
