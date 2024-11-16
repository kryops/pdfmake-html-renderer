<script lang="ts">
  import type { ContentToc } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getTocItemNodes, getTocTarget } from '../logic/toc'
  import { getTocItemStyleString } from '../styling/toc'
  import ContentRenderer from './ContentRenderer.svelte'

  interface Props {
    node: ContentToc;
  }

  let { node }: Props = $props();

  const document = getDocument()
  const nodes = getDocumentNodes()
</script>

<div>
  {#if node.toc.title}
    <div class="phr-title">
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

<style>
  .phr-title {
    margin-bottom: 12pt;
  }
  .phr-tocItem {
    display: block;
    margin: 6pt 0;
    text-decoration: unset;
    color: unset;
  }
</style>
