<script lang="ts">
  import type { Content } from 'pdfmake/interfaces'
  import { getDocument, getDocumentNodes } from '../context'
  import { getContentRenderer, normalizeNode } from '../logic/content'
  import { getTocTarget } from '../logic/toc'
  import { getContentStyleString } from '../styling/content'
  import ContentLinkRenderer from './ContentLinkRenderer.svelte'
  import ContentTextRenderer from './ContentTextRenderer.svelte'
  import StringRenderer from './StringRenderer.svelte'

  export interface Props {
    node: Content | any
    inline?: boolean
    inToc?: boolean
    inLink?: boolean
    overrideStyle?: string | undefined
    first?: boolean | undefined
    last?: boolean | undefined
  }

  let {
    node: rawNode,
    inline = false,
    inToc = false,
    inLink = false,
    overrideStyle = undefined,
    first = undefined,
    last = undefined,
  }: Props = $props()

  const node = $derived(normalizeNode(rawNode))
  const document = $derived(getDocument())
  let style = $derived(
    overrideStyle ?? getContentStyleString(node, document, inline)
  )
  let component = $derived(getContentRenderer(node, inLink))
  let id = $derived(
    typeof node === 'object' && node && !inToc
      ? 'tocItem' in node
        ? getTocTarget(node, getDocumentNodes())
        : 'id' in node
          ? node.id
          : undefined
      : undefined
  )

  // pdfmake renders empty text as an empty line with the height of the font.
  // We use a zero-width space to create the line, except for inline text
  // (e.g. fragments of a text array), where empty text has no effect.
  const isEmptyText = $derived(
    node === '' ||
      (component === ContentTextRenderer &&
        typeof node === 'object' &&
        (node.text === '' || node.text == null))
  )
  const emptyLine = '\u200b'
  let neverNode = $derived(
    (isEmptyText && !inline
      ? typeof node === 'string'
        ? emptyLine
        : { ...node, text: emptyLine }
      : node) as never
  )
</script>

{#if !inToc && typeof node === 'object' && node && 'pageBreak' in node && (node.pageBreak === 'before' || node.pageBreak === 'beforeEven' || node.pageBreak === 'beforeOdd')}
  <hr />
{/if}

<svelte:boundary onerror={error => console.error(error)}>
  {#if component === ContentLinkRenderer}
    {@const SvelteComponent = component}
    <SvelteComponent {node} />
  {:else if component}
    {#if !isEmptyText || !inline || component === StringRenderer}
      {@const SvelteComponent_1 = component}
      <div {style} {id}>
        <SvelteComponent_1 node={neverNode} {inline} {first} {last} />
      </div>
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
  div {
    display: inline;
    background: var(--background);
    background-clip: content-box;
  }

  hr {
    margin: 24pt 0;
  }

  .phr-unknown {
    color: red;
  }
</style>
