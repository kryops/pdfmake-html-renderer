import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'
import { beeImage } from './images'

// https://github.com/bpampuch/pdfmake/blob/master/examples/background.js
const document: TDocumentDefinitions = {
  background: function (page) {
    if (page !== 2) {
      return [
        'Background paragraph on page ' + page,
        'Another background paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
        {
          image: 'bee',
          width: 200,
        },
      ]
    }
  },
  content: [
    'First paragraph',
    'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
    '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
    'Another Page',
    '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
    'Another Page',
  ],

  images: {
    bee: beeImage,
  },
}

performDocumentSnapshotTests(document)
