import { Style, TableOfContent, TableCellProperties } from 'pdfmake/interfaces'

// Types updates not yet released to DefinitelyTyped
declare module 'pdfmake/interfaces' {
  interface TableOfContent {
    hideEmpty?: boolean | undefined
    sortBy?: 'title' | 'page' | undefined
    sortLocale?: string | undefined
  }

  interface Style {
    decorationThickness?: number | undefined
    // cannot actually exist on all styles, only on the ones in the styles dictionary
    extends?: string | string[] | undefined
  }

  interface TableCellProperties {
    verticalAlignment?: 'top' | 'middle' | 'bottom' | undefined
  }
}
