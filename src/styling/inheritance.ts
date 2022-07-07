import type {
  Style,
  StyleReference,
  TDocumentDefinitions,
} from 'pdfmake/interfaces'

export function getStyleProperty<T extends keyof Style>(
  property: T,
  style: StyleReference | undefined,
  document: TDocumentDefinitions
): Style[T] | undefined {
  if (typeof style === 'string') {
    const documentStyle = document.styles?.[style]
    if (documentStyle?.[property] !== undefined) return documentStyle[property]
  } else if (Array.isArray(style)) {
    for (const styleOrNameName of [...style].reverse()) {
      if (typeof styleOrNameName === 'object') {
        if (styleOrNameName[property] !== undefined)
          return styleOrNameName[property]
      } else {
        const documentStyle = document.styles?.[styleOrNameName]
        if (documentStyle?.[property] !== undefined)
          return documentStyle[property]
      }
    }
  } else if (typeof style === 'object' && style) {
    if (style[property] !== undefined) return style[property]
  }

  if (document.defaultStyle?.[property] !== undefined)
    return document.defaultStyle[property]

  return undefined
}
