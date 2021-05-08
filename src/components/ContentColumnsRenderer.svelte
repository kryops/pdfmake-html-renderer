<script type="ts">
  import type { ContentColumns } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getColumnGap, getColumnStyleString } from '../styling/column'
  import { getDocument } from '../context'

  export let node: ContentColumns

  const document = getDocument()
  $: gap = getColumnGap(node, $document)
</script>

<div class="container" style="margin: 0 -{gap / 2}pt">
  {#each node.columns as column}
    <div style={getColumnStyleString(column, gap)}>
      <ContentRenderer node={column} />
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
  }
</style>
