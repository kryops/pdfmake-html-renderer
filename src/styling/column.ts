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

export function getColumnStyleString(node: Content) {
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
    } else if (column.width === undefined || column.width === '*') {
      Object.assign(styles, starWidthStyle)
    } else {
      styles.width = getSize(column.width)
    }
  }

  return getStyleString(styles)
}
