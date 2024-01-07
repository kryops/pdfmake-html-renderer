import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'
import { beeImage } from './images'

// https://github.com/bpampuch/pdfmake/blob/master/examples/links.js
const document: TDocumentDefinitions = {
  content: [
    {
      text: [
        'Link to ',
        {
          text: 'pdfmake website',
          link: 'http://pdfmake.org',
          decoration: 'underline',
        },
        ' and ',
        {
          text: 'documentation',
          link: 'https://pdfmake.github.io/docs/',
          decoration: 'underline',
        },
        '.',
      ],
    },
    { text: 'Go to page 2', linkToPage: 2, decoration: 'underline' },
    {
      text: 'Link to header 2',
      linkToDestination: 'header2',
      decoration: 'underline',
    },
    'Links are also supported with images:',
    { image: beeImage, width: 150, link: 'http://pdfmake.org' },
    'With link to page',
    { image: beeImage, width: 150, linkToPage: 2 },
    'And link to header 2',
    { image: beeImage, width: 150, linkToDestination: 'header2' },
    { text: 'Header on page 2', fontSize: 18, bold: true, pageBreak: 'before' },
    {
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sollicitudin. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Suspendisse nisl. Mauris elementum mauris vitae tortor. Phasellus et lorem id felis nonummy placerat. Aliquam erat volutpat. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Etiam bibendum elit eget erat. Nullam rhoncus aliquam metus. Proin mattis lacinia justo. Nullam sit amet magna in magna gravida vehicula. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Integer lacinia. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor.',
    },
    '\n\n',
    { text: 'Header 2', id: 'header2', fontSize: 18, bold: true },
    { text: 'Go to page 1', linkToPage: 1, decoration: 'underline' },
  ],
}

performDocumentSnapshotTests(document)
