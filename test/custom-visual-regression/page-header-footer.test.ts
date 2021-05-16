import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { performDocumentSnapshotTests } from '../image-snapshot'

const document: TDocumentDefinitions = {
  header: 'Header',
  content: 'Content',
  footer: (currentPage, pageCount) => ({
    text: `${currentPage}/${pageCount}`,
    alignment: 'right',
  }),
  pageMargins: [100, 100],
  pageSize: 'A6',
}

performDocumentSnapshotTests(document)
