import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { getContext } from 'svelte'
import type { Readable, Writable } from 'svelte/store'

export const documentContextKey = 'pdfmake-document'
export const nodesContextKey = 'pdfmake-nodes'

export function getDocument(): TDocumentDefinitions {
  return getContext<() => TDocumentDefinitions>(documentContextKey)()
}

export function getDocumentNodes(): Content[] {
  return getContext<() => Content[]>(nodesContextKey)()
}
