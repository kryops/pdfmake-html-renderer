<script lang="ts">
  import type { Content } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: Content[]
  export let inline = false
  export let first = true
  export let last = true
</script>

{#if inline}
  <span>
    {#each node as entry, i}
      <ContentRenderer
        node={entry}
        inline
        first={first && i === 0}
        last={last && i === node.length - 1}
      />
    {/each}
  </span>
{:else}
  {#each node as entry}
    <p>
      <ContentRenderer node={entry} />
    </p>
  {/each}
{/if}

<style>
  span {
    /* Prevent whitespace between inline nodes */
    font-size: 0;
  }
  span > :global(*) {
    font-size: var(--font-size);
  }

  p {
    margin: 0;
  }
</style>
