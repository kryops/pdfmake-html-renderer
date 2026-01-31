import type { Content, ContentToc, ContentTocItem } from 'pdfmake/interfaces'
import { toArray } from '../logic/utils'
import { flattenNodes } from './content'

export function getTocItemNodes(tocNode: ContentToc, content: Content) {
  const itemNodes = flattenNodes(content).filter(
    node =>
      typeof node === 'object' &&
      node &&
      'tocItem' in node &&
      'text' in node &&
      toArray(node.tocItem).includes(tocNode.toc.id ?? true)
  ) as ContentTocItem[]

  return tocNode.toc.sortBy === 'title'
    ? itemNodes.sort((a, b) => {
        // guard against invalid locale tags throwing
        try {
          return getTocItemText(a).localeCompare(
            getTocItemText(b),
            tocNode.toc.sortLocale
          )
        } catch {
          return 0
        }
      })
    : itemNodes
}

export function getTocTarget(node: Content, allNodes: Content[]) {
  const index = allNodes.indexOf(node)
  if (index === -1) return undefined
  return `node${index + 1}`
}

function getTocItemText(
  tocItem: ContentTocItem | string | Array<ContentTocItem | string>
): string {
  if (typeof tocItem === 'string') {
    return tocItem
  }

  if (Array.isArray(tocItem)) {
    return tocItem.map(getTocItemText).join('')
  }

  if (typeof tocItem.text === 'string') {
    return tocItem.text
  }

  if (Array.isArray(tocItem.text)) {
    return tocItem.text.map(getTocItemText).join('')
  }

  return ''
}
