import type { Margins } from 'pdfmake/interfaces'
import { normalizeMargins } from './margin'

export function getHeaderHeight(pageMargins: Margins | undefined): string {
  if (pageMargins == null) return '40pt'
  return normalizeMargins(pageMargins)[1] + 'pt'
}

export function getFooterHeight(pageMargins: Margins | undefined): string {
  if (pageMargins == null) return '40pt'
  return normalizeMargins(pageMargins)[3] + 'pt'
}
