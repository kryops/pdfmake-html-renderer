<script type="ts">
  import type { Content } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getContentRenderer } from '../logic/content'
  import { getTocTarget } from '../logic/toc'
  import { getContentStyleString } from '../styling/content'
  import ContentLinkRenderer from './ContentLinkRenderer.svelte'
  import ContentTextRenderer from './ContentTextRenderer.svelte'

  export let node: Content | any
  export let inline = false
  export let inToc = false
  export let inLink = false
  export let overrideStyle: string | undefined = undefined
  export let first: boolean | undefined = undefined
  export let last: boolean | undefined = undefined

  const document = getDocument()
  const nodes = getDocumentNodes()
  $: style = overrideStyle ?? getContentStyleString(node, $document, inline)
  $: component = getContentRenderer(node, inLink)
  $: id =
    typeof node === 'object' && node && !inToc
      ? 'tocItem' in node
        ? getTocTarget(node, $nodes)
        : 'id' in node
        ? node.id
        : undefined
      : undefined
</script>

{#if !inToc && typeof node === 'object' && node && 'pageBreak' in node && node.pageBreak === 'before'}
  <hr />
{/if}

{#if component === ContentLinkRenderer}
  <svelte:component this={component} {node} />
{:else if component}
  {#if component !== ContentTextRenderer || !('text' in node) || node.text !== ''}
    <span {style} {id}>
      <svelte:component this={component} {node} {inline} {first} {last} />
    </span>
  {/if}
{:else}
  <span class="phr-unknown">Unknown: {JSON.stringify(node)}</span>
{/if}

{#if !inToc && typeof node === 'object' && node && 'pageBreak' in node && node.pageBreak === 'after'}
  <hr />
{/if}

<style>
  span {
    background: var(--background);
    /* text would probably be better, but browser support is still bad */
    background-clip: content-box;
  }

  hr {
    margin: 24pt 0;
  }

  .phr-unknown {
    color: red;
  }
</style>
