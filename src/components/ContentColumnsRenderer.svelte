<script lang="ts">
  import type { ContentColumns } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getColumnStyleString } from '../styling/column'

  export let node: ContentColumns
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
