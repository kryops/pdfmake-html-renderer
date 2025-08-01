import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { test } from '@playwright/test'
import { takeSnapshots } from '../image-snapshot'

// https://github.com/bpampuch/pdfmake/blob/master/examples/watermark.js
const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id semper massa, nec dapibus mauris. Mauris in mattis nibh. Aenean feugiat volutpat aliquam. Donec sed tellus feugiat, dignissim lectus id, eleifend tortor. Ut at mauris vel dui euismod accumsan. Cras sodales, ante sit amet varius dapibus, dolor neque finibus justo, vel ornare arcu dolor vitae tellus. Aenean faucibus egestas urna in interdum. Mauris convallis dolor a condimentum sagittis. Suspendisse non laoreet nisl. Curabitur sed pharetra ipsum. Curabitur aliquet purus vitae pharetra tincidunt. Cras aliquam tempor justo sit amet euismod. Praesent risus magna, lobortis eget dictum sit amet, tristique vel enim. Duis aliquet, urna maximus sollicitudin lobortis, mi nunc dignissim ligula, et lacinia magna leo non sem.'

const document: TDocumentDefinitions = {
  //watermark: 'test watermark',
  watermark: {
    text: 'test watermark',
    color: 'blue',
    opacity: 0.3,
    bold: true,
    italics: false,
  },
  content: ['Test page of watermark.\n\n', lorem],
}

test('pdfmake/watermark', async ({ page }) => {
  await takeSnapshots(document, page)
})
