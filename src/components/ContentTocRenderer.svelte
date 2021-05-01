<script type="ts">
  import type { ContentToc } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getTocItemNodes, getTocTarget } from '../logic/toc'
  import { getTocItemStyleString } from '../styling/toc'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: ContentToc

  const document = getDocument()
  const nodes = getDocumentNodes()
</script>

<div>
  {#if node.toc.title}
    <div class="title">
      <ContentRenderer node={node.toc.title} />
    </div>
  {/if}
  {#each getTocItemNodes($document.content) as tocItem}
    <a class="tocItem" href="#{getTocTarget(tocItem, $nodes)}">
      <ContentRenderer
        node={tocItem}
        inToc
        overrideStyle={getTocItemStyleString(tocItem, node, $document)}
      />
    </a>
  {/each}
</div>

<style>
  .title {
    margin-bottom: 12pt;
  }
  .tocItem {
    display: block;
    margin: 6pt 0;
    text-decoration: unset;
    color: unset;
  }
</style>
