import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    {
      table: {
        widths: [50, 50],
        body: [
          ['One', 'Two'],
          // incomplete borderColor does not override v/hLineColor
          [{ text: 'Three', borderColor: ['yellow'] as any }, 'Four'],
          [{ text: 'Overflowing Text', noWrap: true }, {}],
        ],
      },
      layout: {
        vLineColor: 'red',
        hLineWidth: () => null, // == 0
        vLineWidth: () => null, // != 0
        paddingLeft: () => null, // == 0
      },
    },
    ' ',
    {
      table: {
        heights: 40,
        body: [
          [{ text: 'top', verticalAlignment: 'top' }, 'column B'],
          [{ text: 'middle', verticalAlignment: 'middle' }, 'column B'],
          [{ text: 'bottom', verticalAlignment: 'bottom' }, 'column B'],
        ],
      },
    },
  ],
}

// fillColor from named styles
const namedStyleFill: TDocumentDefinitions = {
  styles: {
    header: { fillColor: '#ffcccc', bold: true },
    translucent: { fillColor: '#0000ff', fillOpacity: 0.2 },
    wrapper: { extends: 'header' },
  },
  content: [
    {
      table: {
        body: [
          [
            { text: 'named style', style: 'header' },
            {
              text: 'direct property wins',
              style: 'header',
              fillColor: '#ccffcc',
            },
            { text: 'style array', style: ['translucent'] },
            { text: 'extended', style: 'wrapper' },
          ],
          ['plain', 'plain', 'plain', 'plain'],
        ],
      },
    },
    { text: '' },
    { table: { body: [['inherited from table style', 'x']] }, style: 'header' },
    { text: '' },
    {
      table: {
        body: [[{ text: 'cell beats layout', style: 'header' }, 'layout']],
      },
      layout: { fillColor: () => '#ccccff' },
    },
  ],
}

// Layout borders at the table edge for cells that span multiple columns / rows
const spanBorders: TDocumentDefinitions = {
  content: [
    {
      table: {
        widths: [60, 60, 60],
        body: [
          ['a', { text: 'colSpan 2', colSpan: 2 }, {}],
          [{ text: 'rowSpan 2', rowSpan: 2 }, 'b', 'c'],
          ['', 'b', 'c'],
        ],
      },
      layout: {
        vLineWidth: (i, node) =>
          i === 0 || i === node.table.widths!.length ? 4 : 0,
        hLineWidth: (i, node) =>
          i === 0 || i === node.table.body.length ? 4 : 0,
        vLineColor: () => 'red',
        hLineColor: () => 'red',
      },
    },
  ],
}

// null cells and primitive values
const cellValues: TDocumentDefinitions = {
  content: [
    {
      table: {
        body: [
          ['a', null as any, { text: 'colSpan 2', colSpan: 2 }, null as any],
          [1, 2.5, true as any, ''],
        ],
      },
    },
  ],
}

// All * columns have the same width, independent of their content
const starWidths: TDocumentDefinitions = {
  content: [
    {
      table: {
        widths: ['*', '*', '*'],
        body: [['short', 'a much longer cell with lots of text in it', 'mid']],
      },
    },
    { text: '' },
    { table: { widths: [100, '*', '*'], body: [['100pt', 'x', 'y']] } },
    { text: '' },
    {
      table: { widths: [100, '*'], body: [['noBorders', 'rest']] },
      layout: 'noBorders',
    },
    { text: '' },
    {
      table: { widths: ['20%', '*', '*'], body: [['20%', 'x', 'y']] },
      layout: { paddingLeft: () => 10, paddingRight: () => 10 },
    },
  ],
}

// One combined snapshot to keep the number of images low
const combined: TDocumentDefinitions = {
  styles: namedStyleFill.styles,
  content: [
    ...(document.content as Content[]),
    ' ',
    ...(namedStyleFill.content as Content[]),
    ' ',
    ...(spanBorders.content as Content[]),
    ' ',
    ...(cellValues.content as Content[]),
    ' ',
    ...(starWidths.content as Content[]),
  ],
}

test('custom/tables', async ({ page }) => {
  await takeSnapshots(combined, page)
})
