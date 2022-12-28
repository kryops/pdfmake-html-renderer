<script lang="ts">
  import type { ContentText } from 'pdfmake/interfaces'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'
  import ContentRenderer from './ContentRenderer.svelte'
  import StringRenderer from './StringRenderer.svelte'

  export let node: ContentText
  export let first = true
  export let last = true
</script>

{#if Array.isArray(node.text)}
  <ContentArrayRenderer
    node={node.text}
    inline
    first={first && !node.preserveLeadingSpaces}
    last={last && !node.preserveTrailingSpaces}
  />
{:else if typeof node.text === 'string' || typeof node.text === 'number'}
  {#if node.text !== ''}
    <StringRenderer
      node={node.text}
      first={first && !node.preserveLeadingSpaces}
      last={last && !node.preserveTrailingSpaces}
    />
  {/if}
{:else}
  <ContentRenderer
    node={node.text}
    first={first && !node.preserveLeadingSpaces}
    last={last && !node.preserveTrailingSpaces}
  />
{/if}
