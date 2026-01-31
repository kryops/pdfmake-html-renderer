<script lang="ts">
  import type { ContentToc } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getTocItemNodes, getTocTarget } from '../logic/toc'
  import { getTocItemStyleString } from '../styling/toc'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: ContentToc

  const document = getDocument()
  const nodes = getDocumentNodes()

  $: items = getTocItemNodes(node, $document.content)
</script>

{#if !node.toc.hideEmpty || items.length > 0}
  <div>
    {#if node.toc.title}
      <div>
        <ContentRenderer node={node.toc.title} />
      </div>
    {/if}
    {#each getTocItemNodes(node, $document.content) as tocItem}
      <a class="phr-tocItem" href="#{getTocTarget(tocItem, $nodes)}">
        <ContentRenderer
          node={tocItem}
          inToc
          overrideStyle={getTocItemStyleString(tocItem, node, $document)}
        />
      </a>
    {/each}
  </div>
{/if}

<style>
  .phr-tocItem {
    display: block;
    margin: 0;
    margin-bottom: 4pt;
    text-decoration: unset;
    color: unset;
  }
</style>
