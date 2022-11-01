import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Lorem ipsum dolor sit amet.',
    {
      text: 'Positive margin',
      margin: [10, 10, 10, 10],
    },
    {
      text: 'Positive margin (should not collapse)',
      margin: [10, 10, 10, 10],
    },
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
    {
      background: 'red',
      ul: ['List', 'with', 'background'],
    },
    'Lorem ipsum dolor sit amet.',
    {
      background: 'red',
      ol: ['List', 'with', 'background'],
    },
    'Lorem ipsum dolor sit amet.',
  ],
  styles: {
    red: {
      background: 'red',
    },
  },
}

performDocumentSnapshotTests(document)
