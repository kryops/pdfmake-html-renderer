import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'
import { beeImage } from './images'

// https://github.com/bpampuch/pdfmake/blob/master/examples/images.js

const document: TDocumentDefinitions = {
  content: [
    "pdfmake (since it's based on pdfkit) supports JPEG and PNG format",
    'If no width/height/fit is provided, image original size will be used',
    { image: beeImage },
    'If you specify width, image will scale proportionally',
    { image: beeImage, width: 150 },
    'If you specify both width and height - image will be stretched',
    { image: beeImage, width: 150, height: 150 },
    'You can also fit the image inside a rectangle',
    { image: beeImage, fit: [100, 100], pageBreak: 'after' },
    'You can also cover the image inside a rectangle',
    {
      image: beeImage,
      cover: { width: 100, height: 100, valign: 'bottom', align: 'right' },
      pageBreak: 'after',
    },
    'Images can be also provided in dataURL format\n(the one below was taken from http://www.clipartbest.com/clipart-dT7zx5rT9)',
    { image: beeImage, width: 200 },
    'or be defined in the "images" dictionary, which can be referenced by name:',
    { image: 'bee', width: 200 },
    'or be defined in the "images" dictionary via URL address, which can be referenced by name:',
    { image: 'snow', height: 200 },
    'and opacity is supported:',
    { image: beeImage, width: 150, opacity: 0.5 },
  ],
  images: { bee: beeImage, snow: 'https://picsum.photos/seed/picsum/200/300' },
}

test('pdfmake/images', async ({ page }) => {
  await takeSnapshots(document, page)
})
