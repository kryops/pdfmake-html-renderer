import type { Content, Style, TDocumentDefinitions } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getPageSize } from './page'
import { getStyleDictionary } from './style'
import { getStyleString } from './utils'

function getContentStyleDictionary(
  node: Content,
  document: TDocumentDefinitions,
  inline: boolean
): CssDictionary {
  const pageSize = getPageSize(document)
  const maxWidth =
    pageSize.orientation === 'landscape' ? pageSize.height : pageSize.width

  const styles: CssDictionary = {
    'max-width': maxWidth + 'pt',
  }

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

  if (typeof node !== 'object' || !node || Array.isArray(node)) {
    return styles
  }

  const applyBaseStyle = (nameOrStyle: string | Style) => {
    if (typeof nameOrStyle === 'object') {
      Object.assign(styles, nameOrStyle)
      return
    }

    const baseStyle = document.styles?.[nameOrStyle]
    if (baseStyle) {
      Object.assign(styles, getStyleDictionary(baseStyle))
    }
  }

  if (node.style) {
    if (typeof node.style === 'string') {
      applyBaseStyle(node.style)
    } else if (Array.isArray(node.style)) {
      node.style.forEach(applyBaseStyle)
    } else {
      Object.assign(styles, getStyleDictionary(node.style))
    }
  }

  Object.assign(styles, getStyleDictionary(node))

  if (inline) {
    Object.assign(styles, {
      display: 'inline',
      padding: '0',
    })
  } else {
    if (node.absolutePosition && typeof node.absolutePosition === 'object') {
      Object.assign(styles, {
        position: 'absolute',
        left: `${node.absolutePosition.x ?? 0}pt`,
        top: `${node.absolutePosition.y ?? 0}pt`,
      })
    }
    if (node.relativePosition && typeof node.relativePosition === 'object') {
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
    if (styles.padding?.includes('-')) {
      styles.margin = styles.padding
      delete styles.padding
    }

    // For lists, we put their background into a CSS variable
    // and apply it to their children instead
    if ((node.ul || node.ol) && styles.background) {
      styles['--list-background'] = styles.background
      delete styles.background
    }
  }

  return styles
}

export function getContentStyleString(
  node: Content,
  document: TDocumentDefinitions,
  inline = false
) {
  const styles = getContentStyleDictionary(
    typeof node === 'string' || typeof node === 'number'
      ? { text: node }
      : node,
    document,
    inline
  )
  return getStyleString(styles)
}
