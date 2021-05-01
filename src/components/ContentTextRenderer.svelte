<script type="ts">
  import type { ContentText } from 'pdfmake/interfaces'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'
  import ContentRenderer from './ContentRenderer.svelte'
  import StringRenderer from './StringRenderer.svelte'

  export let node: ContentText
</script>

{#if Array.isArray(node.text)}
  <ContentArrayRenderer node={node.text} inline />
{:else if typeof node.text === 'string'}
  <StringRenderer node={node.text} />
{:else}
  <ContentRenderer node={node.text} />
{/if}
