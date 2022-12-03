import type { Content, ContentToc, ContentTocItem } from 'pdfmake/interfaces'
import { toArray } from '../logic/utils'
import { flattenNodes } from './content'

export function getTocItemNodes(tocNode: ContentToc, content: Content) {
  return flattenNodes(content).filter(
    node =>
      typeof node === 'object' &&
      node &&
      'tocItem' in node &&
      toArray(node.tocItem).includes(tocNode.toc.id ?? true)
  ) as ContentTocItem[]
}

export function getTocTarget(node: Content, allNodes: Content[]) {
  const index = allNodes.indexOf(node)
  if (index === -1) return undefined
  return `node${index + 1}`
}
