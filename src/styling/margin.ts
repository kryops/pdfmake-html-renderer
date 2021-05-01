import type { Margins } from 'pdfmake/interfaces'

export function getMarginString(
  margins: Margins | undefined,
  defaultMargin = 0
): string {
  if (!margins) return defaultMargin + 'pt'
  if (Array.isArray(margins)) {
    if (margins.length >= 4) {
      const [left, top, right, bottom] = margins
      return [top, right, bottom, left].map(it => (it ?? 0) + 'pt').join(' ')
    } else {
      const [horizontal, vertical] = margins
      return [vertical, horizontal].map(it => (it ?? 0) + 'pt').join(' ')
    }
  }
  return margins + 'pt'
}
