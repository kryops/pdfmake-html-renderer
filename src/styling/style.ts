import type { Style } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getMarginString } from './margin'
import { colorToRgb } from './utils'

export function getStyleDictionary(style: Style | undefined) {
  const obj: CssDictionary = {}

  if (!style) return obj

  if (style.font)
    obj['font-family'] = style.font + ', Roboto, Helvetica, sans-serif'
  if (style.fontSize) {
    obj['font-size'] = style.fontSize + 'pt'
    obj['--font-size'] = style.fontSize + 'pt'
  }
  if (style.lineHeight) obj['line-height'] = String(style.lineHeight)
  if (style.bold !== undefined)
    obj['font-weight'] = style.bold ? 'bold' : 'normal'
  if (style.italics !== undefined)
    obj['font-style'] = style.italics ? 'italic' : 'normal'
  if (style.alignment) {
    obj['text-align'] = style.alignment
    obj.display = 'block'
  }
  if (style.color) obj.color = style.color
  // TODO some elements only inherit the background down to their children
  // instead of applying it to the container itself (e.g. lists)
  // We ignore tiling patterns (arrays)
  if (style.background && !Array.isArray(style.background))
    obj.background = style.background
  if (style.margin) {
    obj.display = 'block'
    obj['margin'] = getMarginString(style.margin)
  }
  if (style.decoration) {
    obj['text-decoration'] =
      style.decoration === 'lineThrough' ? 'line-through' : style.decoration
  }
  if (style.decorationColor) {
    obj['text-decoration-color'] = style.decorationColor
  }
  if (style.decorationStyle) {
    obj['text-decoration-style'] = style.decorationStyle
  }
  if (style.preserveLeadingSpaces) {
    obj['white-space'] = 'pre-wrap'
    obj['--white-space'] = 'pre-wrap'
  }
  if (style.opacity) obj.opacity = String(style.opacity)
  if (style.characterSpacing)
    obj['letter-spacing'] = style.characterSpacing + 'pt'
  if (style.leadingIndent) obj['text-indent'] = style.leadingIndent + 'pt'
  if (style.sub || style.sup) {
    // cannot use super as font-size: 0 within array will move the baseline
    obj['vertical-align'] = style.sub ? 'sub' : 'top'
    if (!style.fontSize) {
      obj['font-size'] = 'calc(var(--font-size) * 0.58)'
      // cannot redeclare --font-size variable as it would try to use it for the element itself
    }
  }

  // inherit to table cells below
  if (style.fillColor) {
    const fillColorRgb = colorToRgb(style.fillColor)
    if (fillColorRgb) obj['--fill-color'] = fillColorRgb.join(', ')
  }
  if (style.fillOpacity !== undefined)
    obj['--fill-opacity'] = String(style.fillOpacity)

  return obj
}
