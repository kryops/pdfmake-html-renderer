import type { ContextPageSize, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getMarginString } from './margin'
import { getStyleDictionary } from './style'
import { getStyleString } from './utils'

const pageSizes = {
  // via https://github.com/reb2020/5no-paper-sizes
  '4A0': [4768, 6741],
  '2A0': [3370, 4768],
  A0: [2384, 3370],
  A1: [1684, 2384],
  A2: [1191, 1684],
  A3: [842, 1191],
  A4: [595, 842],
  A5: [420, 595],
  A6: [298, 420],
  A7: [210, 298],
  A8: [147, 210],
  A9: [105, 147],
  A10: [74, 105],
  B0: [2835, 4008],
  B1: [2004, 2835],
  B2: [1417, 2004],
  B3: [1001, 1417],
  B4: [709, 1001],
  B5: [499, 709],
  B6: [354, 499],
  B7: [249, 354],
  B8: [176, 249],
  B9: [125, 176],
  B10: [88, 125],
  C0: [2599, 3677],
  C1: [1837, 2599],
  C2: [1298, 1837],
  C3: [918, 1298],
  C4: [649, 918],
  C5: [459, 649],
  C6: [323, 459],
  C7: [230, 323],
  C8: [162, 230],
  C9: [113, 162],
  C10: [79, 113],
  // via https://papersizes.io/raw/ra0
  RA1: [1279, 2438],
  RA2: [1219, 1729],
  RA3: [864, 1219],
  RA4: [609, 864],
  SRA1: [1814, 2551],
  SRA2: [1275, 1814],
  SRA3: [907, 1275],
  SRA4: [637, 907],
  // via https://www.prepressure.com/library/paper-size
  // and https://www.gnu.org/software/gv/manual/html_node/Paper-Keywords-and-paper-size-in-points.html
  EXECUTIVE: [522, 756],
  FOLIO: [612, 936],
  LEGAL: [612, 1008],
  LETTER: [612, 792],
  TABLOID: [792, 1224],
} as const

export function getPageSize(document: TDocumentDefinitions): ContextPageSize {
  let width: number = pageSizes.A4[0]
  let height: number = pageSizes.A4[1]

  if (typeof document.pageSize === 'string') {
    if (pageSizes[document.pageSize]) {
      width = pageSizes[document.pageSize][0]
      height = pageSizes[document.pageSize][0]
    }
  } else if (typeof document.pageSize === 'object') {
    width = document.pageSize.width
    if (document.pageSize.height !== 'auto') {
      height = document.pageSize.height
    }
  }

  return {
    width,
    height,
    orientation: document.pageOrientation ?? 'portrait',
  }
}

export function getPageStyleString(
  document: TDocumentDefinitions,
  maxWidth: number
): string {
  const style: CssDictionary = {
    padding: getMarginString(document.pageMargins, 40),
  }

  const { width, height } = getPageSize(document)

  const pageWidth = document.pageOrientation === 'landscape' ? height : width

  style.width = pageWidth + 'pt'

  const maxWidthInPt = (maxWidth * 3) / 4
  if (pageWidth > maxWidthInPt) {
    style.zoom = String(maxWidthInPt / pageWidth)
  }

  Object.assign(style, getStyleDictionary(document.defaultStyle))

  return getStyleString(style)
}
