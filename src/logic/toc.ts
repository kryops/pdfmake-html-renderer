import type { Content, ContentTocItem } from 'pdfmake/interfaces'
import { flattenNodes } from './content'

export function getTocItemNodes(content: Content) {
  return flattenNodes(content).filter(
    node => typeof node === 'object' && 'tocItem' in node
  ) as ContentTocItem[]
}

export function getTocTarget(node: Content, allNodes: Content[]) {
  const index = allNodes.indexOf(node)
  if (index === -1) return undefined
  return `node${index + 1}`
}
