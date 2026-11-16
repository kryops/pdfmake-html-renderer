import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    'Spaces\n\n',
    '',
    ' ',
    { table: { body: [[{ text: '   default     ' }]] } },
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
    // empty text renders an empty line in pdfmake
    'Empty text between two tables:',
    { table: { body: [['a']] } },
    { text: '' },
    { table: { body: [['b']] } },
    'Empty string, empty text with a larger font size, and inline empty text:',
    '',
    { text: '', fontSize: 30 },
    { text: ['inline ', '', { text: '' }, 'empties'] },
    'Empty list item and empty table cells:',
    { ul: ['a', '', 'c'] },
    {
      table: {
        body: [
          ['x', ''],
          ['', null as any],
        ],
      },
    },
  ],
}

test('custom/spaces', async ({ page }) => {
  await takeSnapshots(document, page)
})
