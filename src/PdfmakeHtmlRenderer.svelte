<script lang="ts">
  import { run } from 'svelte/legacy';

  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { setContext } from 'svelte'
  import { contextKey } from './context'
  import DocumentRenderer from './components/DocumentRenderer.svelte'
  import { writable } from 'svelte/store'
  import { flattenNodes } from './logic/content'
  import type { PageSizeMode } from './styling/page'

  interface Props {
    document: TDocumentDefinitions;
    pageShadow?: boolean;
    mode?: PageSizeMode;
  }

  let { document, pageShadow = true, mode = 'shrinkToFit' }: Props = $props();

  const documentStore = writable(document)
  run(() => {
    documentStore.set(document)
  });
  const nodesStore = writable(flattenNodes(document?.content))
  run(() => {
    nodesStore.set(flattenNodes(document?.content))
  });

  setContext(contextKey, {
    document: documentStore,
    nodes: nodesStore,
  })
</script>

{#if document}
  <DocumentRenderer {document} {pageShadow} {mode} />
{/if}
