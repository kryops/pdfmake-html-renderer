import {
  Style,
  TableOfContent,
  TableCellProperties,
  ContentColumns,
} from 'pdfmake/interfaces'

// Types updates not yet released to DefinitelyTyped
declare module 'pdfmake/interfaces' {
  interface TableCellProperties {
    verticalAlignment?: 'top' | 'middle' | 'bottom' | undefined
  }

  interface ContentColumns {
    snakingColumns?: boolean | undefined
  }
}
