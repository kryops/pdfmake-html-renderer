import type { Content, ContentTable, TableCell } from 'pdfmake/interfaces'

export type ActualTableCell = Content & {
  rowSpan?: number
  colSpan?: number
  border?: [boolean, boolean, boolean, boolean]
  borderColor?: [string, string, string, string]
  fillOpacity?: number
  verticalAlignment?: 'top' | 'middle' | 'bottom' | undefined
}

export function isActualTableCell(cell: TableCell): cell is ActualTableCell {
  return cell !== '' && Boolean(Object.keys(cell).length)
}

/**
 * Returns a set of `rowIndex-columnIndex` keys for cells that are covered
 * by the `colSpan` and/or `rowSpan` of another cell.
 *
 * pdfmake forces us to put "empty" cells there, but then ignores them.
 */
export function getTableCellsCoveredBySpans(node: ContentTable): Set<string> {
  const coveredCells = new Set<string>()

  node.table?.body?.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (isActualTableCell(column)) {
        if (
          (column.rowSpan && column.rowSpan > 1) ||
          (column.colSpan && column.colSpan > 1)
        ) {
          for (let i = 0; i < (column.rowSpan ?? 1); i++) {
            for (let j = 0; j < (column.colSpan ?? 1); j++) {
              if (i !== 0 || j !== 0)
                coveredCells.add(`${rowIndex + i}-${columnIndex + j}`)
            }
          }
        }
      }
    })
  })

  return coveredCells
}

export function shouldRenderCell(
  cell: TableCell,
  rowIndex: number,
  columnIndex: number,
  coveredCells: Set<string>
): cell is ActualTableCell {
  return !coveredCells.has(`${rowIndex}-${columnIndex}`)
}
