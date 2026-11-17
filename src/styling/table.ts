import type {
  PatternFill,
  ContentTable,
  CustomTableLayout,
  Style,
  TDocumentDefinitions,
} from 'pdfmake/interfaces'
import type { ActualTableCell } from '../logic/table'
import type { CssDictionary } from './css-dictionary'
import { getSize } from './size'
import { getEffectiveNamedStyle } from './style'
import { getPatternCssUrl } from './pattern'
import { colorToRgb, getStyleString } from './utils'

type ColumnWidth = number | string | null | undefined

function getColumnWidths(table: ContentTable): ColumnWidth[] | undefined {
  const { widths, body } = table.table
  if (typeof widths === 'string') {
    return Array.isArray(body?.[0]) ? body[0].map(() => widths) : [widths]
  }
  if (!Array.isArray(widths)) return undefined

  // pdfmake mutates the table widths to contain objects
  return widths.map(width =>
    typeof width === 'object' && width ? (width as any).width : width
  )
}

const isStar = (width: ColumnWidth) =>
  width == null || width === '*' || width === 'star'

/**
 * pdfmake gives all `*` columns the same width, which HTML tables only do
 * with a fixed layout. This is not possible with `auto` columns, as they are
 * sized by their content.
 */
export function hasFixedTableLayout(table: ContentTable): boolean {
  const widths = getColumnWidths(table)
  return (
    !!widths && widths.some(isStar) && !widths.some(width => width === 'auto')
  )
}

/** The left and right padding of a column in a table with the given layout */
function getColumnPadding(table: ContentTable, columnIndex: number): number {
  const columns = getColumnWidths(table)?.length ?? 1
  const isFirst = columnIndex === 0
  const isLast = columnIndex === columns - 1

  switch (table.layout) {
    case 'noBorders':
      return (isFirst ? 0 : 4) + (isLast ? 0 : 4)
    case 'headerLineOnly':
    case 'lightHorizontalLines':
      return (isFirst ? 0 : 8) + (isLast ? 0 : 8)
  }

  if (typeof table.layout === 'object' && table.layout) {
    const layout = table.layout as CustomTableLayout
    const normalizedTable = {
      ...table,
      table: { ...table.table, widths: getColumnWidths(table) },
    }
    const padding = (property: CustomTableLayout['paddingLeft']) => {
      if (typeof property === 'number') return property
      if (typeof property !== 'function') return 4
      try {
        return Number(property(columnIndex, normalizedTable as any)) || 0
      } catch {
        return 4
      }
    }
    return padding(layout.paddingLeft) + padding(layout.paddingRight)
  }

  return 8
}

/** Style of a `<col>` element for tables with a fixed layout */
export function getTableColumnStyleString(
  table: ContentTable,
  columnIndex: number
): string | undefined {
  const width = getColumnWidths(table)?.[columnIndex]
  if (isStar(width) || width == null) return undefined

  const size = getSize(width)
  // the column width includes the padding, while the specified width does not
  return getStyleString({
    width: size.includes('%')
      ? size
      : `calc(${size} + ${getColumnPadding(table, columnIndex)}pt)`,
  })
}

export function getTableColumnCount(table: ContentTable): number {
  return getColumnWidths(table)?.length ?? 0
}

export function getTableStyleString(node: ContentTable): string | undefined {
  if (!node.table.widths && !node.tableAlignment) return undefined

  const style: CssDictionary = {}

  if (hasFixedTableLayout(node)) {
    style['table-layout'] = 'fixed'
    style['width'] = '100%'
  } else if (getColumnWidths(node)?.some(isStar)) {
    // columns with auto width are sized by their content
    style['width'] = '100%'
  }

  if (node.tableAlignment === 'right' || node.tableAlignment === 'center') {
    style['margin-left'] = 'auto'
  }
  if (node.tableAlignment === 'center') style['margin-right'] = 'auto'

  return getStyleString(style)
}

/** The fill that a cell gets from its named styles */
function getFillFromStyles(
  node: ActualTableCell,
  document: TDocumentDefinitions
): Pick<Style, 'fillColor' | 'fillOpacity'> {
  const result: Pick<Style, 'fillColor' | 'fillOpacity'> = {}
  if (typeof node !== 'object' || !node || !('style' in node) || !node.style)
    return result

  const styles = Array.isArray(node.style) ? node.style : [node.style]
  for (const entry of styles) {
    const effective =
      typeof entry === 'string'
        ? document.styles?.[entry]
          ? getEffectiveNamedStyle(document.styles, entry)
          : {}
        : entry
    if (effective.fillColor != null) result.fillColor = effective.fillColor
    if (effective.fillOpacity != null)
      result.fillOpacity = effective.fillOpacity
  }
  return result
}

export function getTableCellStyleString(
  node: ActualTableCell,
  table: ContentTable,
  rowIndex: number,
  columnIndex: number,
  document: TDocumentDefinitions
): string {
  const style: CssDictionary = {}
  // the right/bottom lines of a cell are after its last spanned column/row
  const colSpan = (typeof node === 'object' && node && node.colSpan) || 1
  const rowSpan = (typeof node === 'object' && node && node.rowSpan) || 1

  if (Array.isArray(table.table.widths)) {
    // pdfmake mutates the table widths to contain objects
    let columnWidth = table.table.widths[columnIndex]
    if (typeof columnWidth === 'object' && 'width' in columnWidth) {
      columnWidth = (columnWidth as any).width
    }

    // we treat *-sized columns like auto for now,
    // but set the table's width to 100% when at least one column is *-sized
    if (columnWidth != null && columnWidth !== 'auto' && columnWidth !== '*') {
      const width = getSize(columnWidth)
      style.width = width
      // overflow longer text
      style['max-width'] = width
      // pdfmake breaks words that are wider than the column
      style['overflow-wrap'] = 'anywhere'
    }
  }

  // We set the height on the cell instead of the row, as the cell's padding
  // is taken into respect this way
  if (typeof table.table.heights === 'number') {
    style.height = table.table.heights + 'pt'
  } else if (Array.isArray(table.table.heights)) {
    const height = table.table.heights[rowIndex]
    if (height != null) style.height = height + 'pt'
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
            horizontal ? rowIndex + rowSpan : columnIndex + colSpan,
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
        style['--fill-color'] = fillColorRgb.join(', ')
        style['--fill-opacity'] = '1'
      }
    }
    if (fillOpacity != null) style['--fill-opacity'] = String(fillOpacity)

    if (table.layout.defaultBorder === false) {
      style['border-style'] = 'none'
    }
  }

  const styleFill = getFillFromStyles(node, document)
  if (styleFill.fillColor) {
    const fillColorRgb = colorToRgb(styleFill.fillColor)
    if (fillColorRgb) {
      style['--fill-color'] = fillColorRgb.join(', ')
      style['--fill-opacity'] = '1'
    }
  }
  if (styleFill.fillOpacity != null)
    style['--fill-opacity'] = String(styleFill.fillOpacity)

  if (typeof node === 'object' && node) {
    if ('noWrap' in node && node.noWrap) {
      style['white-space'] = 'nowrap'
      style['--white-space'] = 'nowrap'
    }
    if ('fillColor' in node && node.fillColor) {
      const fillColorRgb = colorToRgb(node.fillColor)
      if (fillColorRgb) {
        style['--fill-color'] = fillColorRgb.join(', ')
        style['--fill-opacity'] = '1'
      }
    }
    if ('fillOpacity' in node)
      style['--fill-opacity'] = String(node.fillOpacity)

    // patterns are drawn above the fill color
    const patternImages: string[] = []
    const { overlayPattern, overlayOpacity } = node as {
      overlayPattern?: PatternFill
      overlayOpacity?: number | null
    }
    if (Array.isArray(overlayPattern)) {
      const overlay = getPatternCssUrl(
        overlayPattern,
        document.patterns,
        overlayOpacity
      )
      if (overlay) patternImages.push(overlay)
    }
    if ('fillColor' in node && Array.isArray(node.fillColor)) {
      const fill = getPatternCssUrl(
        node.fillColor as PatternFill,
        document.patterns,
        'fillOpacity' in node ? node.fillOpacity : undefined
      )
      if (fill) patternImages.push(fill)
    }
    if (patternImages.length)
      style['background-image'] = patternImages.join(', ')

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
    if (node.verticalAlignment) {
      style['vertical-align'] = node.verticalAlignment
    }
  }

  return getStyleString(style)
}
