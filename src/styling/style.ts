import type { Style } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getMarginString, getMarginStringFromStyle } from './margin'
import { colorToRgb } from './utils'

export function getStyleDictionary(style: Style | undefined, isNode = false) {
  const obj: CssDictionary = {}

  if (!style || typeof style !== 'object') return obj

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
  // We ignore tiling patterns (arrays)
  if (style.background && !Array.isArray(style.background)) {
    obj.background = style.background
    // text would probably be better, but browser support is still bad
    obj['background-clip'] = 'content-box'
  }
  const marginStyle = getMarginStringFromStyle(style)
  if (marginStyle !== undefined) {
    obj.display = 'block'
    // we set padding instead of margin because pdfmake does not collapse margins
    if (!isNode || style.margin !== undefined) {
      obj.padding = marginStyle
    } else {
      if (style.marginLeft !== undefined)
        obj['padding-left'] = style.marginLeft + 'pt'
      if (style.marginTop !== undefined)
        obj['padding-top'] = style.marginTop + 'pt'
      if (style.marginRight !== undefined)
        obj['padding-right'] = style.marginRight + 'pt'
      if (style.marginBottom !== undefined)
        obj['padding-bottom'] = style.marginBottom + 'pt'
    }
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
  if (style.opacity) obj.opacity = String(style.opacity)
  if (style.characterSpacing)
    obj['letter-spacing'] = style.characterSpacing + 'pt'
  if (style.leadingIndent) {
    obj['text-indent'] = style.leadingIndent + 'pt'
    obj.display = 'block'
  }
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
    if (fillColorRgb) {
      obj['--fill-color'] = fillColorRgb.join(', ')
      obj['--fill-opacity'] = '1'
    }
  }
  if (style.fillOpacity !== undefined)
    obj['--fill-opacity'] = String(style.fillOpacity)

  if (style.noWrap) {
    obj['white-space'] = 'nowrap'
    obj['--white-space'] = 'nowrap'
  }

  if (style.columnGap !== undefined) {
    obj['--column-gap'] = String(Number(style.columnGap) / 2) + 'pt'
  }

  return obj
}
