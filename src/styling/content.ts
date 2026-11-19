import type { Content, Style, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getPageSize } from './page'
import { getEffectiveNamedStyle, getStyleDictionary } from './style'
import { getStyleString, omitNullish } from './utils'

export interface ContentStyleOptions {
  /** Apply text decorations through CSS variables, see `getStyleDictionary` */
  decorationVariables?: boolean
  fluid?: boolean
}

function getContentStyleDictionary(
  node: Content,
  document: TDocumentDefinitions,
  inline: boolean,
  { decorationVariables = false, fluid = false }: ContentStyleOptions
): CssDictionary {
  const styles: CssDictionary = {}

  // the page size is ignored in fluid mode
  if (!fluid) styles['max-width'] = getPageSize(document).width + 'pt'

  // some elements need display: block
  // - columns to grow properly
  // - nested lists for proper layouting
  // - the table of contents
  // - stacks and non-inline arrays
  if (
    (Array.isArray(node) && !inline) ||
    (typeof node === 'object' &&
      node &&
      ('columns' in node ||
        'ul' in node ||
        'ol' in node ||
        'toc' in node ||
        'stack' in node))
  )
    styles.display = 'block'
  else if (inline) styles.display = 'inline'
  // required for fontSize as otherwise the line-height would be wrong.
  // We cannot always assign inline-block because it messes up the vertical align of list markers
  else if (
    typeof node === 'object' &&
    node &&
    ('fontSize' in node || 'lineHeight' in node)
  )
    styles.display = 'inline-block'

  // some elements do not apply backgrounds, only their children do
  if (
    Array.isArray(node) ||
    (typeof node === 'object' &&
      (node.stack || node.ul || node.ol || node.columns || node.qr))
  ) {
    styles.background = 'transparent'
  }

  if (typeof node !== 'object' || !node || Array.isArray(node)) {
    return styles
  }

  const applyBaseStyle = (nameOrStyle: string | Style) => {
    if (typeof nameOrStyle === 'object') {
      Object.assign(
        styles,
        getStyleDictionary(omitNullish(nameOrStyle), false, decorationVariables)
      )
      return
    }

    const baseStyle = document.styles?.[nameOrStyle]
    if (baseStyle) {
      Object.assign(
        styles,
        getStyleDictionary(
          getEffectiveNamedStyle(document.styles!, nameOrStyle),
          false,
          decorationVariables
        )
      )
    }
  }

  if ('style' in node && node.style) {
    if (typeof node.style === 'string') {
      applyBaseStyle(node.style)
    } else if (Array.isArray(node.style)) {
      node.style.forEach(applyBaseStyle)
    } else {
      Object.assign(
        styles,
        getStyleDictionary(node.style, false, decorationVariables)
      )
    }
  }

  Object.assign(styles, getStyleDictionary(node, true, decorationVariables))

  if (inline) {
    Object.assign(styles, {
      display: 'inline',
      padding: '0',
    })
  } else {
    if (
      'absolutePosition' in node &&
      node.absolutePosition &&
      typeof node.absolutePosition === 'object'
    ) {
      Object.assign(styles, {
        position: 'absolute',
        left: `${node.absolutePosition.x ?? 0}pt`,
        top: `${node.absolutePosition.y ?? 0}pt`,
      })
    }
    if (
      'relativePosition' in node &&
      node.relativePosition &&
      typeof node.relativePosition === 'object'
    ) {
      // relative positioning removes the space taken.
      // it can be combined with absolute positioning
      Object.assign(styles, {
        position: 'absolute',
        transform: `translate(${node.relativePosition.x ?? 0}pt, ${
          node.relativePosition.y ?? 0
        }pt)`,
      })
    }

    // for negative margin, we cannot use padding
    for (const suffix of ['', '-left', '-top', '-right', '-bottom'] as const) {
      if (styles[`padding${suffix}`]?.includes('-')) {
        styles[`margin${suffix}`] = styles[`padding${suffix}`]
        delete styles[`padding${suffix}`]
      }
    }
  }

  return styles
}

export function getContentStyleString(
  node: Content,
  document: TDocumentDefinitions,
  inline = false,
  options: ContentStyleOptions = {}
) {
  const styles = getContentStyleDictionary(
    typeof node === 'string' || typeof node === 'number'
      ? { text: node }
      : node,
    document,
    inline,
    options
  )
  return getStyleString(styles)
}
