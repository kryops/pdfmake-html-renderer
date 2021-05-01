<script type="ts">
  import type { Content } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getContentRenderer } from '../logic/content'
  import { getTocTarget } from '../logic/toc'
  import { getContentStyleString } from '../styling/content'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'
  import StringRenderer from './StringRenderer.svelte'

  export let node: Content
  export let inline = false
  export let inToc = false
  export let inLink = false
  export let overrideStyle: string | undefined = undefined

  const document = getDocument()
  const nodes = getDocumentNodes()
  $: style = overrideStyle ?? getContentStyleString(node, $document, inline)
  $: component = getContentRenderer(node, inLink)
  $: id =
    typeof node === 'object' && !inToc
      ? 'tocItem' in node
        ? getTocTarget(node, $nodes)
        : 'id' in node
        ? node.id
        : undefined
      : undefined
</script>

{#if !inToc && typeof node === 'object' && 'pageBreak' in node && node.pageBreak === 'before'}
  <hr />
{/if}

{#if typeof node === 'string'}
  <StringRenderer {node} />
{:else if Array.isArray(node)}
  <ContentArrayRenderer {node} />
{:else if component}
  <span {style} {id}>
    <svelte:component this={component} {node} />
  </span>
{:else}
  <span class="unknown">Unknown: {JSON.stringify(node)}</span>
{/if}

{#if !inToc && typeof node === 'object' && 'pageBreak' in node && node.pageBreak === 'after'}
  <hr />
{/if}

<style>
  hr {
    margin: 24pt 0;
  }

  .unknown {
    color: red;
  }
</style>
