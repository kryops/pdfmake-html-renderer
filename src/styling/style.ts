import type {
  Content,
  Style,
  DecorationStyle,
  StyleDictionary,
} from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getInheritedMarginOverride, getMarginStringFromStyle } from './margin'
import { colorToRgb, omitNullish } from './utils'

export function getStyleDictionary(
  input: Style | Content | undefined,
  isNode = false,
  decorationVariables = false
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

  if (style.font != null)
    obj['font-family'] = style.font + ', Roboto, Helvetica, sans-serif'
  if (style.fontSize != null) {
    obj['font-size'] = style.fontSize + 'pt'
    obj['--font-size'] = style.fontSize + 'pt'
  }
  if (style.lineHeight != null) obj['line-height'] = String(style.lineHeight)
  if (style.bold != null) obj['font-weight'] = style.bold ? 'bold' : 'normal'
  if (style.italics != null)
    obj['font-style'] = style.italics ? 'italic' : 'normal'
  if (style.alignment != null) {
    obj['text-align'] = style.alignment
    obj.display = 'block'
  }
  if (style.color != null) obj.color = style.color
  // We ignore tiling patterns (arrays)
  if (style.background != null && !Array.isArray(style.background)) {
    obj['--background'] = style.background
  }
  const marginStyle = getMarginStringFromStyle(style)
  if (marginStyle != null) {
    obj.display = 'block'
    // we set padding instead of margin because pdfmake does not collapse margins
    if (!isNode || style.margin != null) {
      obj.padding = marginStyle
    } else {
      if (style.marginLeft != null)
        obj['padding-left'] = style.marginLeft + 'pt'
      if (style.marginTop != null) obj['padding-top'] = style.marginTop + 'pt'
      if (style.marginRight != null)
        obj['padding-right'] = style.marginRight + 'pt'
      if (style.marginBottom != null)
        obj['padding-bottom'] = style.marginBottom + 'pt'
    }
  }
  // Text decorations are propagated to child elements by CSS, and children
  // cannot override their line style, color or thickness.
  // When fragments override these, the decoration is instead applied to each
  // text through CSS variables (see StringRenderer).
  const decorationAsVariables = decorationVariables || style.decoration == null
  // Without a decoration of its own, the style may still be combined with a
  // decoration from a named style on the same element, or a parent
  const setDecorationProperty = (name: string, value: string) => {
    if (decorationAsVariables) obj[`--decoration-${name}`] = value
    if (!decorationVariables) obj[`text-decoration-${name}`] = value
  }

  if (style.decoration != null) {
    const decoration = (
      Array.isArray(style.decoration) ? style.decoration : [style.decoration]
    )
      .map(it => (it === 'lineThrough' ? 'line-through' : it))
      .join(' ')
    if (decorationAsVariables) {
      obj['--decoration-line'] = decoration
    } else {
      obj['text-decoration'] = decoration
    }
  }
  if (style.decorationColor != null) {
    setDecorationProperty('color', style.decorationColor)
  }
  if (style.decorationStyle != null) {
    setDecorationProperty('style', style.decorationStyle)
  }
  if (style.decorationThickness != null) {
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

    setDecorationProperty(
      'thickness',
      style.decorationThickness * factor + 'pt'
    )
  }
  if (style.opacity != null) obj.opacity = String(style.opacity)
  if (style.characterSpacing != null)
    obj['letter-spacing'] = style.characterSpacing + 'pt'
  if (style.leadingIndent != null) {
    obj['text-indent'] = style.leadingIndent + 'pt'
    obj.display = 'block'
  }
  if (style.sub || style.sup) {
    // cannot use super as font-size: 0 within array will move the baseline
    obj['vertical-align'] = style.sub ? 'sub' : 'top'
    obj['font-size'] = 'calc(var(--font-size) * 0.58)'
  }

  // inherit to table cells below
  if (style.fillColor != null) {
    const fillColorRgb = colorToRgb(style.fillColor)
    if (fillColorRgb) {
      obj['--fill-color'] = fillColorRgb.join(', ')
      obj['--fill-opacity'] = '1'
    }
  }
  if (style.fillOpacity != null)
    obj['--fill-opacity'] = String(style.fillOpacity)

  if (style.noWrap) {
    obj['white-space'] = 'nowrap'
    obj['--white-space'] = 'nowrap'
  }

  if (style.columnGap != null) {
    obj['--column-gap'] = String(Number(style.columnGap) / 2) + 'pt'
  }

  if (style.fontFeatures?.length) {
    obj['font-feature-settings'] = style.fontFeatures
      .map(feature => JSON.stringify(feature))
      .join(', ')
  }

  if (style.wordBreak === 'break-all') {
    obj['word-break'] = 'break-all'
  }

  return obj
}

export function getEffectiveNamedStyle(
  styleDictionary: StyleDictionary,
  name: string,
  seenStyles?: Set<string>
): Style {
  const style = styleDictionary[name]

  if (!style || seenStyles?.has(name)) return {}

  if (
    style.extends == null ||
    (Array.isArray(style.extends) && style.extends.length === 0)
  ) {
    return omitNullish(style)
  }

  const { extends: originalExtends, ...actualStyle } = style
  const extendsArray = Array.isArray(originalExtends)
    ? originalExtends
    : [originalExtends]

  const baseStyles = extendsArray.map(baseStyleName =>
    getEffectiveNamedStyle(
      styleDictionary,
      baseStyleName,
      // For margins, pdfmake uses a global set that ignores overrides if the style has been seen before
      new Set([...(seenStyles ?? []), name])
    )
  )

  return [...baseStyles, actualStyle].reduce((acc, styleOverride) => {
    const margins = getInheritedMarginOverride(acc, styleOverride)
    return {
      ...acc,
      ...omitNullish(styleOverride),
      ...(margins ? { margin: margins } : {}),
    }
  }, {} as Style)
}

const decorationOverrideKeys = [
  'decorationColor',
  'decorationStyle',
  'decorationThickness',
] as const

/**
 * Whether any (nested) text fragment of the node overrides the decoration
 * color, style or thickness of the node.
 */
export function hasFragmentDecorationOverrides(node: Content): boolean {
  if (typeof node !== 'object' || !node || Array.isArray(node)) return false
  if (!('text' in node) || !Array.isArray(node.text)) return false

  return node.text.some(
    fragment =>
      typeof fragment === 'object' &&
      !!fragment &&
      (decorationOverrideKeys.some(key => (fragment as Style)[key] != null) ||
        hasFragmentDecorationOverrides(fragment))
  )
}
