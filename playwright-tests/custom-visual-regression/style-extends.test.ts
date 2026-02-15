import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const document: TDocumentDefinitions = {
  content: [
    { text: 'Red with marginLeft: 50', style: 'marginLeft' },
    { text: 'Green with margin 20', style: 'margin' },
    { text: 'Green with margin 20 + marginLeft: 50', style: 'marginOverride1' },
    { text: 'Red with margin 20 + marginLeft: 50', style: 'marginOverride2' },
    { text: 'Green with margin 20', style: 'marginOverride3' },
    { text: 'Green with margin 20 + marginTop: 50', style: 'marginOverride4' },
    { text: 'Green without margins', style: 'marginOverride5' },
    {
      text: 'Green with margin 20',
      style: 'marginOverride6',
    },
    {
      text: 'Red with margin 20 + marginLeft: 50',
      style: 'marginOverride7',
    },
    {
      text: 'Green with margin 20',
      style: ['marginOverride2', 'marginOverride3'],
    },

    // NOTE: pdfmake ignores the margin completely, only applies marginLeft
    {
      text: 'Red with margin 20 + marginLeft: 50',
      style: ['marginOverride3', 'marginOverride2'],
    },

    {
      text: 'Red with marginLeft: 50',
      style: ['margin', 'marginLeft'],
    },

    { text: 'Blue, bold, italic', style: 'circle1' },
    { text: 'Orange, bold, italic', style: 'circle2' },
    { text: 'Orange, bold, italic', style: 'circle3' },

    {
      text: 'inline red + undefined => red',
      style: [{ color: 'red' }, { color: undefined }],
      color: undefined,
    },
    {
      text: 'inline red + null => red',
      style: [{ color: 'red' }, { color: null as any }],
      color: null as any,
    },
    { text: 'extends red + undefined => red', style: 'undefined' },
    { text: 'extends red + null => red', style: 'null' },

    '-------',

    { text: 'invisible (opacity: 0)', opacity: 0 },
    { text: 'invisible (fontSize: 0)', fontSize: 0 },
  ],
  styles: {
    red: {
      color: 'red',
    },
    green: {
      color: 'green',
    },

    undefined: {
      extends: 'red',
      color: undefined,
    },
    null: {
      extends: 'red',
      color: null as any,
    },

    marginLeft: {
      marginLeft: 50,
      extends: 'red',
    },
    margin: {
      margin: [20, 20, 20, 20],
      extends: 'green',
    },
    marginOverride1: {
      marginLeft: 50,
      extends: 'margin',
    },
    marginOverride2: {
      extends: ['margin', 'marginLeft'],
    },
    marginOverride3: {
      extends: ['marginLeft', 'margin'],
    },
    marginOverride4: {
      extends: ['marginLeft', 'margin'],
      marginTop: 50,
    },
    marginOverride5: {
      extends: ['marginLeft', 'margin'],
      marginTop: 50,
      margin: [0, 0, 0, 0],
    },
    marginOverride6: {
      extends: ['marginOverride2', 'marginOverride3'],
    },
    marginOverride7: {
      extends: ['marginOverride3', 'marginOverride2'],
    },

    circle1: {
      color: 'blue',
      bold: true,
      extends: 'circle2',
    },
    circle2: {
      color: 'orange',
      italics: true,
      extends: 'circle1',
    },
    circle3: {
      extends: ['circle1', 'circle2'],
    },
  },
}

test('custom/style-extends', async ({ page }) => {
  await takeSnapshots(document, page)
})
