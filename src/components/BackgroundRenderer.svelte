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
  <div class="phr-backgroundLayer">
    <ContentRenderer node={content} />
  </div>
{/if}

<style>
  .phr-backgroundLayer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
