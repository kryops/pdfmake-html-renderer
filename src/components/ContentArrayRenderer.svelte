<script lang="ts">
  import type { Content } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: Content[]
  export let inline = false
  export let first = true
  export let last = true
</script>

{#if inline}
  <div class="phr-inline">
    {#each node as entry, i}
      <ContentRenderer
        node={entry}
        inline
        first={first && i === 0}
        last={last && i === node.length - 1}
      />
    {/each}
  </div>
{:else}
  {#each node as entry}
    <div class="phr-block">
      <ContentRenderer node={entry} />
    </div>
  {/each}
{/if}

<style>
  .phr-inline {
    display: inline;
    /* Prevent whitespace between inline nodes */
    font-size: 0;
  }
  .phr-inline > :global(*) {
    font-size: var(--font-size);
  }

  .phr-block {
    display: block;
    margin: 0;
  }
</style>
