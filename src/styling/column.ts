import type { Content, Column, ContentColumns } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getSize } from './size'
import { getStyleString } from './utils'

export function getColumnStyleString(node: Content, columnCount = 1) {
  const starWidthStyle = {
    'flex-basis': 0,
    'flex-grow': 1,
  }

  const styles: CssDictionary = {
    'flex-grow': '0',
    'flex-shrink': '1',
    margin: `0 var(--column-gap, '0')`,
  }

  if (typeof node !== 'object' || Array.isArray(node)) {
    Object.assign(styles, starWidthStyle)
  } else {
    const column = node as Column
    if (column.width === 'auto') {
      // do nothing - default styles are already applied
    } else if (column.width == null || column.width === '*') {
      Object.assign(styles, starWidthStyle)
    } else {
      const width = getSize(column.width)
      if (width.includes('%')) {
        // pdfmake calculates percentages from the space left after the gaps,
        // which are the margins of all columns here
        styles.width = `calc((100% - 2 * ${columnCount} * var(--column-gap, 0pt)) * ${parseFloat(width) / 100})`
      } else {
        styles.width = width
      }
      // pdfmake breaks words that are wider than the column
      styles['min-width'] = '0'
      styles['overflow-wrap'] = 'anywhere'
    }
  }

  return getStyleString(styles)
}

export function getSnakingColumnsStyleString(node: ContentColumns) {
  return getStyleString({
    'column-count': String(node.columns.length),
    // x2 because it is applied as margin for normal columns
    'column-gap': 'calc(var(--column-gap, 0) * 2)',
  })
}
