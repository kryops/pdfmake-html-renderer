<script type="ts">
  import type { ContentColumns } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getColumnStyleString } from '../styling/column'
  import { getDocument } from '../context'

  export let node: ContentColumns

  const document = getDocument()
</script>

<div class="phr-container">
  {#each node.columns as column}
    <div style={getColumnStyleString(column)}>
      <ContentRenderer node={column} />
    </div>
  {/each}
</div>

<style>
  .phr-container {
    display: flex;
    margin: 0 calc(-1 * var(--column-gap));
  }
</style>
