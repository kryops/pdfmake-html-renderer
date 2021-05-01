import type { Content } from 'pdfmake/interfaces'

function getNodeText(node: Content): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if ('text' in node) return getNodeText(node.text)
  return ''
}

export function getReferenceText(reference: string, nodes: Content[]): string {
  const node = nodes.find(
    node => typeof node === 'object' && 'id' in node && node.id === reference
  )
  if (!node) return ''
  return getNodeText(node)
}
