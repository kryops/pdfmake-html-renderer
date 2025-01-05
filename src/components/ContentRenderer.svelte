<script lang="ts">
  import type { Content } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getContentRenderer } from '../logic/content'
  import { getTocTarget } from '../logic/toc'
  import { getContentStyleString } from '../styling/content'
  import ContentLinkRenderer from './ContentLinkRenderer.svelte'
  import ContentTextRenderer from './ContentTextRenderer.svelte'

  interface Props {
    node: Content | any;
    inline?: boolean;
    inToc?: boolean;
    inLink?: boolean;
    overrideStyle?: string | undefined;
    first?: boolean | undefined;
    last?: boolean | undefined;
  }

  let {
    node,
    inline = false,
    inToc = false,
    inLink = false,
    overrideStyle = undefined,
    first = undefined,
    last = undefined
  }: Props = $props();

  const document = getDocument()
  const nodes = getDocumentNodes()
  let style = $derived(overrideStyle ?? getContentStyleString(node, $document, inline))
  let component = $derived(getContentRenderer(node, inLink))
  let id =
    $derived(typeof node === 'object' && node && !inToc
      ? 'tocItem' in node
        ? getTocTarget(node, $nodes)
        : 'id' in node
        ? node.id
        : undefined
      : undefined)

  let neverNode = $derived(node as never)
</script>

{#if !inToc && typeof node === 'object' && node && 'pageBreak' in node && (node.pageBreak === 'before' || node.pageBreak === 'beforeEven' || node.pageBreak === 'beforeOdd')}
  <hr />
{/if}

<svelte:boundary onerror={error => console.error(error)}>
  {#if component === ContentLinkRenderer}
    {@const SvelteComponent = component}
    <SvelteComponent {node} />
  {:else if component}
    {#if component !== ContentTextRenderer || !('text' in node) || node.text !== ''}
      {@const SvelteComponent_1 = component}
      <span {style} {id}>
        <SvelteComponent_1
          node={neverNode}
          {inline}
          {first}
          {last}
        />
      </span>
    {/if}
  {:else if typeof node === 'object' && node && 'attachment' in node}
    <!-- render nothing -->
  {:else}
    <span class="phr-unknown">Unknown: {JSON.stringify(node)}</span>
  {/if}

  {#snippet failed(error)}
    <span class="phr-unknown">{error}</span>
  {/snippet}
</svelte:boundary>
{#if !inToc && typeof node === 'object' && node && 'pageBreak' in node && (node.pageBreak === 'after' || node.pageBreak === 'afterEven' || node.pageBreak === 'afterOdd')}
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
