import type { Margins } from 'pdfmake/interfaces'

export function getHeaderHeight(pageMargins: Margins | undefined): string {
  if (Array.isArray(pageMargins)) {
    if (pageMargins.length >= 4) {
      return pageMargins[1] + 'pt'
    } else {
      return pageMargins[0] + 'pt'
    }
  }
  return '40pt'
}

export function getFooterHeight(pageMargins: Margins | undefined): string {
  if (Array.isArray(pageMargins)) {
    if (pageMargins.length >= 4) {
      return pageMargins[3] + 'pt'
    } else {
      return pageMargins[1] + 'pt'
    }
  }
  return '40pt'
}
