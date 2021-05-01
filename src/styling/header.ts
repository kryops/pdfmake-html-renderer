import type { TDocumentDefinitions } from 'pdfmake/interfaces'

export function getHeaderHeight(document: TDocumentDefinitions): string {
  if (Array.isArray(document.pageMargins)) {
    if (document.pageMargins.length >= 4) {
      return document.pageMargins[1] + 'pt'
    } else {
      return document.pageMargins[0] + 'pt'
    }
  }
  return '40pt'
}

export function getFooterHeight(document: TDocumentDefinitions): string {
  if (Array.isArray(document.pageMargins)) {
    if (document.pageMargins.length >= 4) {
      return document.pageMargins[3] + 'pt'
    } else {
      return document.pageMargins[1] + 'pt'
    }
  }
  return '40pt'
}
