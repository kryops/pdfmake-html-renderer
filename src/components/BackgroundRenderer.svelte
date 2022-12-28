<script lang="ts">
  import type { Content, DynamicBackground } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getPageSize } from '../styling/page'
  import ContentRenderer from './ContentRenderer.svelte'

  const document = getDocument()

  export let node: Content | DynamicBackground

  $: content =
    typeof node === 'function' ? node(1, getPageSize($document)) : node
</script>

{#if content}
  <ContentRenderer node={content} />
{/if}
