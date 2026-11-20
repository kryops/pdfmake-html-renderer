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

// fit keeps the aspect ratio, so the image is narrower than the fit box
// and is aligned according to its actual size
const fit: TDocumentDefinitions = {
  content: [
    'fit: [100, 30] centered (30x30) and right aligned SVG (60x30)',
    { image: IMG, fit: [100, 30], alignment: 'center' },
    {
      svg: '<svg width="20" height="10"><rect width="20" height="10" fill="#9c3"/></svg>',
      fit: [100, 30],
      alignment: 'right',
    },
  ],
}

const vectors: TDocumentDefinitions = {
  content: [
    'Path, dash phase, round caps on dashed rect, lineWidth: 0 (1pt), auto-closed polyline',
    {
      canvas: [
        {
          type: 'path',
          d: 'M 0 20 C 20 0 40 40 60 20',
          lineWidth: 2,
          lineColor: 'green',
        } as any,
        {
          type: 'line',
          x1: 80,
          y1: 5,
          x2: 200,
          y2: 5,
          lineWidth: 3,
          dash: { length: 10 },
        },
        {
          type: 'line',
          x1: 80,
          y1: 15,
          x2: 200,
          y2: 15,
          lineWidth: 3,
          dash: { length: 10, phase: 5 } as any,
        },
        {
          type: 'rect',
          x: 220,
          y: 0,
          w: 60,
          h: 30,
          lineWidth: 4,
          lineCap: 'round',
          dash: { length: 4, space: 8 },
        } as any,
        {
          type: 'line',
          x1: 300,
          y1: 15,
          x2: 360,
          y2: 15,
          lineWidth: 0,
        },
        {
          type: 'polyline',
          lineWidth: 6,
          points: [
            { x: 380, y: 30 },
            { x: 410, y: 0 },
            { x: 440, y: 30 },
            { x: 380, y: 30 },
          ],
        },
      ],
    },
  ],
}

const combined: TDocumentDefinitions = {
  styles: alignment.styles,
  content: [
    ...[
      alignment,
      naturalSize,
      sizeConstraints,
      gradients,
      fit,
      vectors,
    ].flatMap(doc => [...(doc.content as Content[]), ' ']),
  ],
}

test('custom/media', async ({ page }) => {
  await takeSnapshots(combined, page)
})
