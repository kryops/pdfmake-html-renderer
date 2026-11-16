import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

const IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC'

// alignment is inherited from styles as well
const alignment: TDocumentDefinitions = {
  styles: { centered: { alignment: 'center' } },
  content: [
    { image: IMG, width: 50, alignment: 'center' },
    { image: IMG, width: 50, alignment: 'right' },
    {
      svg: '<svg width="80" height="30"><rect width="80" height="30" fill="red"/></svg>',
      alignment: 'right',
    },
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 80, h: 30, color: 'blue' }],
      alignment: 'center',
    },
    { qr: 'hello', fit: 60, alignment: 'right' },
    { stack: [{ image: IMG, width: 30 }], style: 'centered' },
    { image: IMG, width: 30 },
    'The images should not add any extra space between each other',
  ],
}

// pdfmake uses pixels of images and svgs as points
const naturalSize: TDocumentDefinitions = {
  content: [
    'Without width (10pt), with width: 10, and with height: 10',
    { image: IMG },
    { image: IMG, width: 10 },
    { image: IMG, height: 10 },
    'SVG without node size (150x40pt) and with width: 150',
    {
      svg: '<svg width="150" height="40"><rect width="150" height="40" fill="#39c"/></svg>',
    },
    {
      svg: '<svg viewBox="0 0 150 40"><rect width="150" height="40" fill="#c93"/></svg>',
      width: 150,
    },
  ],
}

const sizeConstraints: TDocumentDefinitions = {
  content: [
    'maxWidth (50x50)',
    { image: IMG, width: 200, maxWidth: 50 } as any,
    'maxHeight (30x30)',
    { image: IMG, width: 200, maxHeight: 30 } as any,
    'minHeight (60x60)',
    { image: IMG, height: 20, minHeight: 60 } as any,
    'minWidth (40x40)',
    { image: IMG, width: 20, minWidth: 40 } as any,
    'maxWidth without size (5x5)',
    { image: IMG, maxWidth: 5 } as any,
  ],
}

// Gradient definitions must not clash between canvases
const gradients: TDocumentDefinitions = {
  content: [
    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          linearGradient: ['red', 'yellow'],
        },
      ],
    },
    { text: '' },
    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 200,
          h: 30,
          linearGradient: ['blue', 'cyan'],
        },
        {
          type: 'ellipse',
          x: 100,
          y: 60,
          r1: 100,
          r2: 25,
          linearGradient: ['green', 'white', 'green'],
        },
      ],
    },
  ],
}

const combined: TDocumentDefinitions = {
  styles: alignment.styles,
  content: [
    ...[alignment, naturalSize, sizeConstraints, gradients].flatMap(doc => [
      ...(doc.content as Content[]),
      ' ',
    ]),
  ],
}

test('custom/media', async ({ page }) => {
  await takeSnapshots(combined, page)
})
