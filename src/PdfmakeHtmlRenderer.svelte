<script lang="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { setContext } from 'svelte'
  import { contextKey } from './context'
  import DocumentRenderer from './components/DocumentRenderer.svelte'
  import { writable } from 'svelte/store'
  import { flattenNodes } from './logic/content'
  import type { PageSizeMode } from './styling/page'

  export let document: TDocumentDefinitions
  export let pageShadow = true
  export let mode: PageSizeMode = 'shrinkToFit'

  const documentStore = writable(document)
  $: documentStore.set(document)
  const nodesStore = writable(flattenNodes(document?.content))
  $: nodesStore.set(flattenNodes(document?.content))

  setContext(contextKey, {
    document: documentStore,
    nodes: nodesStore,
  })
</script>

{#if document}
  <DocumentRenderer {document} {pageShadow} {mode} />
{/if}
