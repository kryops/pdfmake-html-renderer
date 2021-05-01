import type { Style, TDocumentDefinitions } from 'pdfmake/interfaces'

export function getStyleProperty<T extends keyof Style>(
  property: T,
  style: string | string[] | Style | undefined,
  document: TDocumentDefinitions
): Style[T] | undefined {
  if (typeof style === 'string') {
    const documentStyle = document.styles?.[style]
    if (documentStyle?.[property] !== undefined) return documentStyle[property]
  } else if (Array.isArray(style)) {
    for (const styleName of [...style].reverse()) {
      const documentStyle = document.styles?.[styleName]
      if (documentStyle?.[property] !== undefined)
        return documentStyle[property]
    }
  } else if (typeof style === 'object') {
    if (style[property] !== undefined) return style[property]
  }

  if (document.defaultStyle?.[property] !== undefined)
    return document.defaultStyle[property]

  return undefined
}
