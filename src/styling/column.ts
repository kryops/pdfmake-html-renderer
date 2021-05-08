import type {
  Content,
  Column,
  TDocumentDefinitions,
  ContentColumns,
} from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleProperty } from './inheritance'
import { getSize } from './size'
import { getStyleString } from './utils'

export function getColumnStyleString(node: Content, columnGap: number) {
  const starWidthStyle = {
    'flex-basis': 0,
    'flex-grow': 1,
  }

  const styles: CssDictionary = {
    'flex-grow': '0',
    'flex-shrink': '1',
    margin: `0 ${columnGap / 2}pt`,
  }

  if (typeof node !== 'object' || Array.isArray(node)) {
    Object.assign(styles, starWidthStyle)
  } else {
    const column = node as Column
    if (column.width === 'auto') {
      // do nothing - default styles are already applied
    } else if (column.width === undefined || column.width === '*') {
      Object.assign(styles, starWidthStyle)
    } else {
      styles.width = getSize(column.width)
    }
  }

  return getStyleString(styles)
}

export function getColumnGap(
  node: ContentColumns,
  document: TDocumentDefinitions
): number {
  // pdfmake only seems to support numbers here, despite different type definitions
  if (node.columnGap !== undefined) return parseFloat(node.columnGap as any)
  return parseFloat(
    (getStyleProperty('columnGap', node.style, document) as any) ?? 0
  )
}
