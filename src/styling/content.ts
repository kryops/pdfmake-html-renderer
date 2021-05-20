import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
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
    // cannot be block because then the background would span the whole page
    display: inline ? 'inline' : 'inline-block',
  }

  // some elements need display: block
  // - columns to grow properly
  // - nested lists for proper layouting
  if (
    typeof node === 'object' &&
    node &&
    ('columns' in node || 'ul' in node || 'ol' in node)
  )
    styles.display = 'block'

  if (typeof node !== 'object' || !node || Array.isArray(node)) {
    return styles
  }

  const applyBaseStyle = (name: string) => {
    const baseStyle = document.styles?.[name]
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
      margin: '0',
    })
  } else {
    if (node.absolutePosition) {
      Object.assign(styles, {
        position: 'absolute',
        left: `${node.absolutePosition.x ?? 0}pt`,
        top: `${node.absolutePosition.y ?? 0}pt`,
      })
    }
    if (node.relativePosition) {
      // relative positioning removes the space taken.
      // it can be combined with absolute positioning
      Object.assign(styles, {
        position: 'absolute',
        transform: `translate(${node.relativePosition.x ?? 0}pt, ${
          node.relativePosition.y ?? 0
        }pt)`,
      })
    }
  }

  return styles
}

export function getContentStyleString(
  node: Content,
  document: TDocumentDefinitions,
  inline = false
) {
  if (typeof node === 'string' || typeof node === 'number') return undefined
  const styles = getContentStyleDictionary(node, document, inline)
  return getStyleString(styles)
}
