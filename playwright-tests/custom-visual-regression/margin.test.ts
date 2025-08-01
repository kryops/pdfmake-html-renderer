import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Lorem ipsum dolor sit amet.',
    { text: 'Positive margin', margin: [10, 10, 10, 10] },
    { text: 'Positive margin (should not collapse)', margin: [10, 10, 10, 10] },
    'Lorem ipsum dolor sit amet.',
    {
      text: 'Negative margin with background',
      margin: [-5, -5, -5, -5],
      background: 'red',
    },
    'Lorem ipsum dolor sit amet.',
    {
      text: 'Positive margin with background',
      margin: [5, 5, 5, 5],
      background: 'red',
    },
    'Lorem ipsum dolor sit amet.',
    'Lorem ipsum dolor sit amet.',
    {
      text: [
        'Inline',
        { text: 'Positive', margin: [5, 5, 5, 5], background: 'red' },
        'Margin',
      ],
    },
    'Lorem ipsum dolor sit amet.',
    {
      text: [
        'Inline',
        { text: 'Negative', margin: [-5, -5, -5, -5], background: 'red' },
        'Margin',
      ],
    },
    'Lorem ipsum dolor sit amet.',
    {
      text: 'Positive margin with background from inherited style',
      margin: [5, 5, 5, 5],
      style: 'red',
    },
    'Lorem ipsum dolor sit amet.',
    {
      text: 'Positive margin with background',
      margin: [10, 10, 10, 10],
      background: 'red',
    },
    {
      text: 'Positive margin with background (should not collapse)',
      margin: [10, 10, 10, 10],
      background: 'red',
    },
    'Lorem ipsum dolor sit amet.',
    { background: 'red', ul: ['List', 'with', 'background'] },
    'Lorem ipsum dolor sit amet.',
    { background: 'red', ol: ['List', 'with', 'background'] },
    'Lorem ipsum dolor sit amet.',
    { text: 'marginLeft', marginLeft: 100 },
    {
      text: 'margin beats marginLeft',
      marginLeft: 100,
      margin: [10, 10, 10, 10],
    },
    {
      text: 'marginLeft beats margin from style',
      marginLeft: 100,
      style: 'margin',
    },
  ],
  styles: {
    red: { background: 'red' },
    margin: { margin: [10, 10, 10, 10] },
    marginLeft: { marginLeft: 100 },
  },
}

test('custom/margin', async ({ page }) => {
  await takeSnapshots(document, page)
})
