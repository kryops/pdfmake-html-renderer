import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'

// https://github.com/bpampuch/pdfmake/blob/master/examples/qrCode.js
const greeting = 'Can you see me'
const url = 'http://pdfmake.org'
const longText =
  'The amount of data that can be stored in the QR code symbol depends on the datatype (mode, or input character set), version (1, …, 40, indicating the overall dimensions of the symbol), and error correction level. The maximum storage capacities occur for 40-L symbols (version 40, error correction level L):'

function header(text: string) {
  return { text, margins: [0, 0, 0, 8] }
}

const document: TDocumentDefinitions = {
  pageMargins: [10, 10, 10, 10],
  content: [
    header(greeting),
    { qr: greeting },
    '\n',

    header('Colored QR'),
    { qr: greeting, foreground: 'red', background: 'yellow' },
    '\n',

    header(url),
    { qr: url },
    '\n',

    header('A very long text (' + longText.length + ' chars)'),
    { qr: longText },
    '\n',
    header('same long text with fit = 100 and alignment = right'),
    { qr: longText, fit: 150, alignment: 'right' },
  ],
}

performDocumentSnapshotTests(document)
