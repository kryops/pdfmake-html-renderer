<script type="ts">
  import type { Content } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: Content[]
  export let inline = false
</script>

{#each node as entry}
  {#if inline}
    <ContentRenderer node={entry} inline />
  {:else}
    <p>
      <ContentRenderer node={entry} />
    </p>
  {/if}
{/each}

<style>
  p {
    margin: 0;
  }
</style>
