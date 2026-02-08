import type { Margins, Style } from 'pdfmake/interfaces'

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

export function getNegativeHorizontalMarginString(
  margins: Margins | undefined,
  defaultMargin = 0
): string {
  if (!margins) return `0 ${-defaultMargin}pt`
  if (Array.isArray(margins)) {
    if (margins.length >= 4) {
      const [left, top, right, bottom] = margins
      return [0, right, 0, left].map(it => -(it ?? 0) + 'pt').join(' ')
    } else {
      const [horizontal, vertical] = margins
      return [0, horizontal].map(it => -(it ?? 0) + 'pt').join(' ')
    }
  }
  return margins + 'pt'
}

export function getMarginStringFromStyle(style: Style): string | undefined {
  if (style.margin !== undefined) {
    return getMarginString(style.margin)
  }
  const margins: Margins = [
    style.marginLeft ?? 0,
    style.marginTop ?? 0,
    style.marginRight ?? 0,
    style.marginBottom ?? 0,
  ]
  if (margins.some(it => it !== 0)) {
    return getMarginString(margins)
  }

  return undefined
}

function normalizeMargins(margins: Margins): [number, number, number, number] {
  if (Array.isArray(margins)) {
    if (margins.length >= 4) {
      const [left, top, right, bottom] = margins
      return [left, top, right!, bottom!]
    } else {
      const [horizontal, vertical] = margins
      return [horizontal, vertical, horizontal, vertical]
    }
  }
  return [margins, margins, margins, margins]
}

export function getInheritedMarginOverride(
  baseStyle: Style,
  style: Style
): Margins | undefined {
  if (baseStyle.margin === undefined || style.margin !== undefined)
    return undefined

  const normalizedBaseMargins = normalizeMargins(baseStyle.margin)
  return [
    style.marginLeft ?? normalizedBaseMargins[0],
    style.marginTop ?? normalizedBaseMargins[1],
    style.marginRight ?? normalizedBaseMargins[2],
    style.marginBottom ?? normalizedBaseMargins[3],
  ]
}
