import { Style, TableOfContent } from 'pdfmake/interfaces'

// Types updates not yet released to DefinitelyTyped
declare module 'pdfmake/interfaces' {
  interface TableOfContent {
    hideEmpty?: boolean | undefined
    sortBy?: 'title' | 'page' | undefined
    sortLocale?: string | undefined
  }

  interface Style {
    decorationThickness?: number | undefined
  }
}
