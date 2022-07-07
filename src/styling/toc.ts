import type {
  ContentToc,
  ContentTocItem,
  Style,
  TDocumentDefinitions,
} from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getMarginString } from './margin'
import { getStyleDictionary } from './style'
import { getStyleString } from './utils'

export function getTocItemStyleString(
  node: ContentTocItem,
  tocNode: ContentToc,
  document: TDocumentDefinitions
) {
  // styles on the node itself seem to replace the styles on the ToC completely
  const textStyle = node.tocStyle ?? tocNode.toc.textStyle
  const margin = node.tocMargin ?? tocNode.toc.textMargin

  const style: CssDictionary = {
    display: 'block',
    padding: getMarginString(margin),
  }

  const applyBaseStyle = (nameOrStyle: string | Style) => {
    if (typeof nameOrStyle === 'object') {
      Object.assign(style, nameOrStyle)
      return
    }

    const baseStyle = document.styles?.[nameOrStyle]
    if (baseStyle) {
      Object.assign(style, getStyleDictionary(baseStyle))
    }
  }

  if (textStyle) {
    if (typeof textStyle === 'string') {
      applyBaseStyle(textStyle)
    } else if (Array.isArray(textStyle)) {
      textStyle.forEach(applyBaseStyle)
    } else {
      Object.assign(style, getStyleDictionary(textStyle))
    }
  }

  return getStyleString(style)
}
