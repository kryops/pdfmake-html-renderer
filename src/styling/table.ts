import type { ContentTable, CustomTableLayout } from 'pdfmake/interfaces'
import type { ActualTableCell } from '../logic/table'
import type { CssDictionary } from './css-dictionary'
import { getSize } from './size'
import { colorToRgb, getStyleString } from './utils'

export function getTableStyleString(node: ContentTable): string | undefined {
  if (!node.table.widths) return undefined

  const style: CssDictionary = {}

  if (node.table.widths) {
    console.log(node.table)
    if (node.table.widths === '*') {
      style['table-layout'] = 'fixed'
      style['width'] = '100%'
    } else if (
      Array.isArray(node.table.widths) &&
      node.table.widths.includes('*')
    ) {
      style['width'] = '100%'
      style['word-wrap'] = 'break-word'
      style['font-size'] = '8px'
    } else
    {
      style['table-layout'] = 'auto'
      style['width'] = '100%'
      style['word-wrap'] = 'break-word'
      style['font-size'] = '8px'
    }
  }

  return getStyleString(style)
}

export function getTableCellStyleString(
  node: ActualTableCell,
  table: ContentTable,
  rowIndex: number,
  columnIndex: number
): string {
  const style: CssDictionary = {}

  if (Array.isArray(table.table.widths)) {
    const columnWidth = table.table.widths[columnIndex]
    // we treat *-sized columns like auto for now,
    // but set the table's width to 100% when at least one column is *-sized
    if (
      columnWidth !== undefined &&
      columnWidth !== 'auto' &&
      columnWidth !== '*'
    ) {
      const width = getSize(columnWidth)
      style.width = width
      // overflow longer text
      style['max-width'] = width
    }
  }

  // We set the height on the cell instead of the row, as the cell's padding
  // is taken into respect this way
  if (typeof table.table.heights === 'number') {
    style.height = table.table.heights + 'pt'
  } else if (Array.isArray(table.table.heights)) {
    const height = table.table.heights[rowIndex]
    if (height !== undefined) style.height = height + 'pt'
  } else if (typeof table.table.heights === 'function') {
    const height = table.table.heights(rowIndex)
    if (height != null && height !== 'auto') style.height = height + 'pt'
  }

  if (typeof table.layout === 'object' && table.layout) {
    // pdfmake seems to expect the widths to always be defined in the layout callbacks
    const normalizedTable = {
      ...table,
      table: {
        ...table.table,
      },
    }

    if (!Array.isArray(table.table.widths)) {
      normalizedTable.table.widths = Array.isArray(table.table.body)
        ? table.table.body[0].map(() => 'auto')
        : 'auto'
    }

    const lineLayoutProperty = (
      key: keyof CustomTableLayout,
      horizontal: boolean,
      callback: (value1: any, value2: any) => void
    ) => {
      const property = (table.layout as CustomTableLayout)[key]
      if (typeof property === 'string') {
        callback(property, property)
      } else if (typeof property === 'function') {
        try {
          const val1 = property(
            horizontal ? rowIndex : columnIndex,
            normalizedTable,
            horizontal ? columnIndex : rowIndex
          )
          const val2 = property(
            horizontal ? rowIndex + 1 : columnIndex + 1,
            normalizedTable,
            horizontal ? columnIndex : rowIndex
          )
          callback(val1, val2)
        } catch {
          // do nothing
        }
      }
    }

    lineLayoutProperty('hLineWidth', true, (top, bottom) => {
      // other than vLineWidth, hLineWidth treats null as 0
      style['border-top-width'] = (top ?? 0) + 'pt'
      style['border-bottom-width'] = (bottom ?? 0) + 'pt'
    })
    lineLayoutProperty('hLineColor', true, (top, bottom) => {
      if (top != null) style['border-top-color'] = top
      if (bottom != null) style['border-bottom-color'] = bottom
    })
    lineLayoutProperty('hLineStyle', true, (top, bottom) => {
      if (top != null && top.dash) style['border-top-style'] = 'dashed'
      if (bottom != null && bottom.dash) style['border-bottom-style'] = 'dashed'
    })
    lineLayoutProperty('vLineWidth', false, (left, right) => {
      if (left != null) style['border-left-width'] = left + 'pt'
      if (right != null) style['border-right-width'] = right + 'pt'
    })
    lineLayoutProperty('vLineColor', false, (left, right) => {
      if (left != null) style['border-left-color'] = left
      if (right != null) style['border-right-color'] = right
    })
    lineLayoutProperty('vLineStyle', false, (left, right) => {
      if (left != null && left.dash) style['border-left-style'] = 'dashed'
      if (right != null && right.dash) style['border-right-style'] = 'dashed'
    })

    const cellLayoutProperty = (
      key: keyof CustomTableLayout,
      horizontal: boolean,
      callback: (value: any) => void
    ) => {
      const property = (table.layout as CustomTableLayout)[key]
      if (typeof property === 'string' || typeof property === 'number') {
        callback(property)
      } else if (typeof property === 'function') {
        try {
          const value = property(
            horizontal ? rowIndex : columnIndex,
            normalizedTable,
            horizontal ? columnIndex : rowIndex
          )
          callback(value)
        } catch {
          // do nothing
        }
      }
    }

    cellLayoutProperty('paddingLeft', false, value => {
      style['padding-left'] = (value ?? 0) + 'pt'
    })
    cellLayoutProperty('paddingRight', false, value => {
      style['padding-right'] = (value ?? 0) + 'pt'
    })
    cellLayoutProperty('paddingTop', true, value => {
      style['padding-top'] = (value ?? 0) + 'pt'
    })
    cellLayoutProperty('paddingBottom', true, value => {
      style['padding-bottom'] = (value ?? 0) + 'pt'
    })

    let fillColor: string | null = null
    let fillOpacity: number | null = null
    cellLayoutProperty('fillColor', true, value => {
      if (value != null) fillColor = value
    })
    cellLayoutProperty('fillOpacity', true, value => {
      if (value != null) fillOpacity = value
    })
    if (fillColor) {
      const fillColorRgb = colorToRgb(fillColor)
      if (fillColorRgb) {
        style['background'] = fillColorRgb.join(', ')
        style['--fill-opacity'] = '1'
      }
    }
    if (fillOpacity != null) style['--fill-opacity'] = String(fillOpacity)

    if (table.layout.defaultBorder === false) {
      style['border-style'] = 'none'
    }
  }

  if (typeof node === 'object' && node) {
    if ('noWrap' in node && node.noWrap) {
      style['white-space'] = 'nowrap'
      style['--white-space'] = 'nowrap'
    }
    if ('fillColor' in node && node.fillColor) {
      const fillColorRgb = colorToRgb(node.fillColor)
      if (fillColorRgb) {
        style['background'] = fillColorRgb.join(', ')
        style['--fill-opacity'] = '1'
      }
    }
    if ('fillOpacity' in node)
      style['--fill-opacity'] = String(node.fillOpacity)

    if ('border' in node && node.border) {
      const [left, top, right, bottom] = node.border
      style['border-left-style'] = left ? 'solid' : 'none'
      style['border-top-style'] = top ? 'solid' : 'none'
      style['border-bottom-style'] = bottom ? 'solid' : 'none'
      style['border-right-style'] = right ? 'solid' : 'none'
    }
    if ('borderColor' in node && node.borderColor) {
      const [left, top, right, bottom] = node.borderColor
      if (left) style['border-left-color'] = left
      if (top) style['border-top-color'] = top
      if (bottom) style['border-bottom-color'] = bottom
      if (right) style['border-right-color'] = right
    }
  }

  return getStyleString(style)
}
