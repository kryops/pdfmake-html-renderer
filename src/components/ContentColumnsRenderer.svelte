<script lang="ts">
  import type { ContentColumns } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import {
    getColumnStyleString,
    getSnakingColumnsStyleString,
  } from '../styling/column'

  export let node: ContentColumns
</script>

<div class="phr-container">
  {#if node.snakingColumns}
    <div style={getSnakingColumnsStyleString(node)}>
      <ContentRenderer node={node.columns[0]} inline />
    </div>
  {:else}
    {#each node.columns as column}
      <div style={getColumnStyleString(column)}>
        <ContentRenderer node={column} />
      </div>
    {/each}
  {/if}
</div>

<style>
  .phr-container {
    display: flex;
    margin: 0 calc(-1 * var(--column-gap));
  }
</style>
