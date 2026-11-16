import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { getContext } from 'svelte'
import type { PageSizeMode } from './styling/page'

export const documentContextKey = 'pdfmake-document'
export const nodesContextKey = 'pdfmake-nodes'
export const modeContextKey = 'pdfmake-mode'
export const decorationVariablesContextKey = 'pdfmake-decoration-variables'

// NOTE: Need to be consumed via $derived() to stay reactive

export function getDocument(): TDocumentDefinitions {
  return getContext<() => TDocumentDefinitions>(documentContextKey)()
}

export function getDocumentNodes(): Content[] {
  return getContext<() => Content[]>(nodesContextKey)()
}

export function getMode(): PageSizeMode {
  return getContext<() => PageSizeMode>(modeContextKey)()
}

/**
 * Whether a parent applies text decorations through CSS variables,
 * so that fragments can override them
 */
export function getParentDecorationVariables(): boolean {
  return (
    getContext<(() => boolean) | undefined>(
      decorationVariablesContextKey
    )?.() ?? false
  )
}
