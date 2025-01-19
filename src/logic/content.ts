import type { Content } from 'pdfmake/interfaces'
import ContentArrayRenderer from '../components/ContentArrayRenderer.svelte'
import StringRenderer from '../components/StringRenderer.svelte'
import ContentTextRenderer from '../components/ContentTextRenderer.svelte'
import ContentColumnsRenderer from '../components/ContentColumnsRenderer.svelte'
import ContentStackRenderer from '../components/ContentStackRenderer.svelte'
import ContentTableRenderer from '../components/ContentTableRenderer.svelte'
import ContentUnorderedListRenderer from '../components/ContentUnorderedListRenderer.svelte'
import ContentOrderedListRenderer from '../components/ContentOrderedListRenderer.svelte'
import ContentImageRenderer from '../components/ContentImageRenderer.svelte'
import ContentSvgRenderer from '../components/ContentSvgRenderer.svelte'
import ContentLinkRenderer from '../components/ContentLinkRenderer.svelte'
import ContentQrRenderer from '../components/ContentQrRenderer.svelte'
import ContentCanvasRenderer from '../components/ContentCanvasRenderer.svelte'
import ContentTocRenderer from '../components/ContentTocRenderer.svelte'
import ContentPageReferenceRenderer from '../components/ContentPageReferenceRenderer.svelte'
import ContentTextReferenceRenderer from '../components/ContentTextReferenceRenderer.svelte'

export function getContentRenderer(node: Content, inLink: boolean) {
  if (typeof node === 'string' || typeof node === 'number') {
    return StringRenderer
  } else if (Array.isArray(node)) {
    return ContentArrayRenderer
  } else if (typeof node === 'object' && node && !Array.isArray(node)) {
    if (!inLink && ('link' in node || 'linkToDestination' in node)) {
      return ContentLinkRenderer
    }

    if (typeof node !== 'object' || !node) return null

    if ('columns' in node && Array.isArray(node.columns)) {
      return ContentColumnsRenderer
    } else if ('stack' in node && Array.isArray(node.stack)) {
      return ContentStackRenderer
    } else if ('ul' in node && Array.isArray(node.ul)) {
      return ContentUnorderedListRenderer
    } else if ('ol' in node && Array.isArray(node.ol)) {
      return ContentOrderedListRenderer
    } else if (
      'table' in node &&
      node.table &&
      typeof node.table === 'object'
    ) {
      return ContentTableRenderer
    } else if ('image' in node && node.image) {
      return ContentImageRenderer
    } else if ('pageReference' in node && node.pageReference != null) {
      return ContentPageReferenceRenderer
    } else if ('textReference' in node && node.textReference != null) {
      return ContentTextReferenceRenderer
    } else if ('text' in node && node.text != null) {
      return ContentTextRenderer
    } else if ('toc' in node && node.toc && typeof node.toc === 'object') {
      return ContentTocRenderer
    } else if ('svg' in node && node.svg) {
      return ContentSvgRenderer
    } else if ('qr' in node && node.qr) {
      return ContentQrRenderer
    } else if ('canvas' in node && Array.isArray(node.canvas)) {
      return ContentCanvasRenderer
    }
  }
  return null
}

export function flattenNodes(node: Content): Content[] {
  if (!node) return []

  const nodes: Content[] = [node]

  if (typeof node === 'string' || typeof node === 'number') {
    return []
  } else if (Array.isArray(node)) {
    node.forEach(child => nodes.push(...flattenNodes(child)))
  }

  if (typeof node !== 'object' || !node) return nodes

  const childKeys = ['columns', 'stack', 'ul', 'ol'] as const
  for (const childKey of childKeys) {
    if (
      childKey in node &&
      Array.isArray(node[childKey as keyof typeof node])
    ) {
      nodes.push(...flattenNodes(node[childKey as keyof typeof node]))
      break
    }
  }

  if (
    'table' in node &&
    node.table &&
    typeof node.table === 'object' &&
    Array.isArray(node.table.body)
  ) {
    node.table.body?.forEach(tr => {
      if (!Array.isArray(tr)) return
      return tr.forEach(td => nodes.push(...flattenNodes(td as Content)))
    })
  } else if ('text' in node && Array.isArray(node.text)) {
    nodes.push(...flattenNodes(node.text))
  }

  return nodes
}
