import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Spaces\n\n',
    '',
    ' ',
    {
      table: {
        body: [[{ text: '   default     ' }]],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: '      with preserveLeadingSpaces      ',
              preserveLeadingSpaces: true,
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: '        with preserveTrailingSpaces      ',
              preserveTrailingSpaces: true,
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: '        with both      ',
              preserveLeadingSpaces: true,
              preserveTrailingSpaces: true,
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: ['      with both ', ' and an array      '],
              preserveLeadingSpaces: true,
              preserveTrailingSpaces: true,
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: [
                'spaces        ',
                'in between',
                '        are always preserved',
              ],
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [
            {
              text: [
                '       ',
                '       edge case: first and last child only have spaces     ',
                '        ',
              ],
            },
          ],
        ],
      },
    },
    {
      table: {
        body: [
          [{ text: '   spacing properties should not inherit down     ' }],
        ],
      },
      preserveLeadingSpaces: true,
      preserveTrailingSpaces: true,
    },
  ],
}

performDocumentSnapshotTests(document)
