import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { getContext } from 'svelte'
import type { Readable, Writable } from 'svelte/store'

export const contextKey = 'pdfmake-document'

export interface RendererContext {
  document: Writable<TDocumentDefinitions>
  nodes: Writable<Content[]>
}

export function getDocument(): Readable<TDocumentDefinitions> {
  return getContext<RendererContext>(contextKey).document
}

export function getDocumentNodes(): Readable<Content[]> {
  return getContext<RendererContext>(contextKey).nodes
}
