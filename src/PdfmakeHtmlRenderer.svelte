<script lang="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { setContext } from 'svelte'
  import { documentContextKey, nodesContextKey } from './context'
  import DocumentRenderer from './components/DocumentRenderer.svelte'
  import { flattenNodes } from './logic/content'
  import type { PageSizeMode } from './styling/page'

  interface Props {
    document: TDocumentDefinitions
    pageShadow?: boolean
    mode?: PageSizeMode
  }

  let { document, pageShadow = true, mode = 'shrinkToFit' }: Props = $props()

  const nodes = $derived(flattenNodes(document?.content))

  setContext(documentContextKey, () => document)
  setContext(nodesContextKey, () => nodes)
</script>

{#if document}
  <DocumentRenderer {document} {pageShadow} {mode} />
{/if}
