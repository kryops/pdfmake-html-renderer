<script lang="ts">
  import type { ContentTextReference } from 'pdfmake/interfaces'
  import { getDocumentNodes } from '../context'
  import { getReferencedNode, getReferenceText } from '../logic/reference'
  import ContentRenderer from './ContentRenderer.svelte'

  export interface Props {
    node: ContentTextReference
  }

  let { node }: Props = $props()

  const nodes = $derived(getDocumentNodes())

  let referencedNode = $derived(getReferencedNode(node.textReference, nodes))
</script>

<a href="#{node.textReference}">
  <!-- we cannot just render the whole referenced node, as its own styles are not applied -->
  {#if referencedNode && typeof referencedNode === 'object' && 'text' in referencedNode}
    <ContentRenderer node={referencedNode.text} inline />
  {:else}
    <span>{getReferenceText(node.textReference, nodes)}</span>
  {/if}
</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
    /* Prevent superfluous whitespace */
    font-size: 0;
  }

  a > :global(*) {
    font-size: var(--font-size);
  }
</style>
