<script type="ts">
  import type { Content, DynamicContent } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getPageSize } from '../styling/page'
  import ContentRenderer from './ContentRenderer.svelte'

  const document = getDocument()

  export let node: Content | DynamicContent
  $: content =
    typeof node === 'function' ? node(1, 1, getPageSize($document)) : node
</script>

{#if content}
  <ContentRenderer node={content} />
{/if}
