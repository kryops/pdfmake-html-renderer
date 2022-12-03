import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Normal text',
    {
      ul: ['Unordered list 1', 'Unordered list 2'],
    },
    {
      ul: ['Green list'],
      background: 'green',
    },
    {
      ol: ['Ordered list 1', 'Ordered list 2 kghjh'],
    },
    {
      columns: ['Column 1', 'Column 2'],
    },
    ' ',
    {
      table: {
        body: [['Table 1', 'Table 2']],
      },
    },
  ],
  defaultStyle: {
    background: 'red',
  },
}

performDocumentSnapshotTests(document)
