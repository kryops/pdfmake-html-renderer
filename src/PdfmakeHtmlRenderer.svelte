<script type="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { setContext } from 'svelte'
  import { contextKey } from './context'
  import DocumentRenderer from './components/DocumentRenderer.svelte'
  import { writable } from 'svelte/store'
  import { flattenNodes } from './logic/content'

  export let document: TDocumentDefinitions

  const documentStore = writable(document)
  $: documentStore.set(document)
  const nodesStore = writable(flattenNodes(document.content))
  $: nodesStore.set(flattenNodes(document.content))

  setContext(contextKey, {
    document: documentStore,
    nodes: nodesStore,
  })
</script>

<DocumentRenderer {document} />
