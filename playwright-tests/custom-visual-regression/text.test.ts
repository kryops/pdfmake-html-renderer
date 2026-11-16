import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// Fragments can override the thickness, color and style of the decoration
const decorations: TDocumentDefinitions = {
  content: [
    {
      text: [
        { text: 'Thin (1pt) ', decorationThickness: 1 },
        { text: 'Thick (6pt) ', decorationThickness: 6 },
        { text: 'Red 3pt ', decorationColor: 'red', decorationThickness: 3 },
        { text: 'Dashed ', decorationStyle: 'dashed' },
        'Inherited ',
        { text: 'Own overline', decoration: 'overline' },
      ],
      fontSize: 22,
      decoration: 'underline',
      decorationColor: '#2563eb',
      decorationThickness: 3,
      margin: [0, 0, 0, 20],
    },
    {
      text: [
        'Named style: ',
        { text: 'thin', decorationThickness: 1 },
        ' thick',
      ],
      style: 'underlined',
      fontSize: 22,
    },
    {
      text: 'Decoration color and thickness on the same node',
      style: 'underlined',
      decorationColor: 'red',
      decorationThickness: 4,
    },
  ],
  styles: { underlined: { decoration: 'underline', decorationThickness: 3 } },
}

// Words wider than the line are broken, also in fixed-width columns and cells
const longWords: TDocumentDefinitions = {
  content: [
    'https://example.com/averyveryveryveryveryverylongurlwithoutanybreakopportunities',
    {
      columns: [
        { width: 60, text: 'Averyveryveryveryverylongwordwithoutbreaks' },
        'short',
      ],
    },
    {
      table: {
        widths: [60, 60],
        body: [['Averyveryverylongwordwithoutbreaks', 'short']],
      },
    },
    { text: 'noWrap is not broken: Averyveryveryverylongword', noWrap: true },
  ],
}

// Tabs are expanded to four spaces, independent of their position
const tabs: TDocumentDefinitions = {
  content: ['a\tb', 'abcdef\tb', { text: ['a', { text: '\tb', bold: true }] }],
}

const fontFeatures: TDocumentDefinitions = {
  content: [
    { text: 'Tabular figures: 1111 / 8888', fontFeatures: ['tnum'] },
    { text: 'Proportional figures: 1111 / 8888', fontFeatures: ['pnum'] },
    { text: 'Multiple: 1111 / 8888', fontFeatures: ['tnum', 'zero'] },
  ],
}

const combined: TDocumentDefinitions = {
  styles: decorations.styles,
  content: [
    ...[decorations, longWords, tabs, fontFeatures].flatMap(doc => [
      ...(doc.content as Content[]),
      ' ',
    ]),
  ],
}

test('custom/text', async ({ page }) => {
  await takeSnapshots(combined, page)
})
