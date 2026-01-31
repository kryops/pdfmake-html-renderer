import type { Content, Style, DecorationStyle } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getMarginStringFromStyle } from './margin'
import { colorToRgb } from './utils'

export function getStyleDictionary(
  input: Style | Content | undefined,
  isNode = false
) {
  const obj: CssDictionary = {}

  if (
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input) ||
    // section nodes do not support style
    ('section' in input && input.section)
  )
    return obj

  const style = input as Style

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
    obj['--background'] = style.background
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
    obj['text-decoration'] = (
      Array.isArray(style.decoration) ? style.decoration : [style.decoration]
    )
      .map(it => (it === 'lineThrough' ? 'line-through' : it))
      .join(' ')
  }
  if (style.decorationColor) {
    obj['text-decoration-color'] = style.decorationColor
  }
  if (style.decorationStyle) {
    obj['text-decoration-style'] = style.decorationStyle
  }
  if (style.decorationThickness) {
    // only an approximation, but good enough
    const factorByStyle: Record<DecorationStyle, number> = {
      solid: 1,
      dashed: 0.5,
      dotted: 0.5,
      double: 0.5,
      wavy: 0.333,
    }
    const factor =
      (style.decorationStyle && factorByStyle[style.decorationStyle]) ||
      factorByStyle.solid

    obj['text-decoration-thickness'] = style.decorationThickness * factor + 'pt'
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

  if ('wordBreak' in style && style.wordBreak === 'break-all') {
    obj['word-break'] = 'break-all'
  }

  return obj
}
