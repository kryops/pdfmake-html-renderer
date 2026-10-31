import {
  Style,
  TableOfContent,
  TableCellProperties,
  ContentColumns,
} from 'pdfmake/interfaces'

// Types updates not yet released to DefinitelyTyped
declare module 'pdfmake/interfaces' {
  interface ContentTable {
    tableAlignment?: 'left' | 'center' | 'right' | undefined
  }
}
