import type { Content } from 'pdfmake/interfaces'

function getNodeText(node: Content): string {
  if (!node) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if ('text' in node && node.text) return getNodeText(node.text)
  return ''
}

export function getReferencedNode(
  reference: string,
  nodes: Content[]
): Content | undefined {
  return nodes.find(
    node =>
      typeof node === 'object' && node && 'id' in node && node.id === reference
  )
}

export function getReferenceText(reference: string, nodes: Content[]): string {
  const node = getReferencedNode(reference, nodes)
  if (!node) return ''
  return getNodeText(node)
}
