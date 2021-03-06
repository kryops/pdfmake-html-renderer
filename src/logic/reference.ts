import type { Content } from 'pdfmake/interfaces'

function getNodeText(node: Content): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if ('text' in node && node.text) return getNodeText(node.text)
  return ''
}

export function getReferenceText(reference: string, nodes: Content[]): string {
  const node = nodes.find(
    node =>
      typeof node === 'object' && node && 'id' in node && node.id === reference
  )
  if (!node) return ''
  return getNodeText(node)
}
