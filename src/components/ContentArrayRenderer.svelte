<script type="ts">
  import type { Content } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: Content[]
  export let inline = false
</script>

{#if inline}
  <span>
    {#each node as entry}
      <ContentRenderer node={entry} inline />
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
