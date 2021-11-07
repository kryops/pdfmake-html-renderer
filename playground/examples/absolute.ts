import { beeImage } from '../../test/pdfmake-examples/images'

// https://github.com/bpampuch/pdfmake/blob/master/examples/absolute.js
export default `{
  content: [
    {
      image: 'bee',
      width: 50,
      height: 50,
      absolutePosition: { x: 100, y: 100 },
    },
    {
      image: 'bee',
      width: 50,
      height: 50,
      absolutePosition: { x: 150, y: 150 },
    },
    {
      image: 'bee',
      width: 50,
      height: 50,
      absolutePosition: { x: 200, y: 200 },
    },
    {
      image: 'bee',
      width: 50,
      height: 50,
      absolutePosition: { x: 250, y: 150 },
    },
    {
      image: 'bee',
      width: 50,
      height: 50,
      absolutePosition: { x: 300, y: 100 },
    },

    {
      text: 'You can put images at any position',
      pageBreak: 'after',
    },

    {
      text: 'As',
      absolutePosition: { x: 100, y: 100 },
    },
    {
      text: 'well',
      absolutePosition: { x: 150, y: 150 },
    },
    {
      text: 'as',
      absolutePosition: { x: 200, y: 200 },
    },
    {
      text: 'text',
      absolutePosition: { x: 250, y: 150 },
    },
    {
      text: '!!!',
      absolutePosition: { x: 300, y: 100 },
      pageBreak: 'after',
    },

    {
      text: 'And this is a table on top of an image at x:100 y:100',
    },
    {
      image: 'bee',
      width: 100,
      height: 100,
      absolutePosition: { x: 100, y: 100 },
    },
    {
      absolutePosition: { x: 100, y: 100 },
      style: 'tableExample',
      table: {
        body: [
          ['Column 1', 'Column 2', 'Column 3'],
          [
            {
              stack: [
                "Let's try an unordered list",
                {
                  ul: ['item 1', 'item 2'],
                },
              ],
            },
            /* a nested table will appear here as soon as I fix a bug */
            [
              'or a nested table',
              {
                table: {
                  body: [
                    ['Col1', 'Col2', 'Col3'],
                    ['1', '2', '3'],
                    ['1', '2', '3'],
                  ],
                },
              },
            ],
            {
              text: [
                'Inlines can be ',
                { text: 'styled\\n', italics: true },
                { text: 'easily as everywhere else', fontSize: 10 },
              ],
            },
          ],
        ],
      },
    },
  ],
  images: {
    bee: '${beeImage}',
  },
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    tableExample: {
      margin: [0, 5, 0, 15],
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
  },
}`
