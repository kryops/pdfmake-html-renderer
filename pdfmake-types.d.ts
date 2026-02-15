import { Style, TableOfContent, TableCellProperties } from 'pdfmake/interfaces'

// Types updates not yet released to DefinitelyTyped
declare module 'pdfmake/interfaces' {
  interface TableCellProperties {
    verticalAlignment?: 'top' | 'middle' | 'bottom' | undefined
  }
}
