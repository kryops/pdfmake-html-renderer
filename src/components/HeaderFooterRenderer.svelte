<script lang="ts">
  import type { Content, DynamicContent, Margins } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getPageSize } from '../styling/page'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getFooterHeight, getHeaderHeight } from '../styling/header'

  const document = getDocument()

  export let type: 'header' | 'footer'
  export let node: Content | DynamicContent
  export let pageMargins: Margins | undefined

  $: content =
    typeof node === 'function' ? node(1, 1, getPageSize($document)) : node
</script>

<div
  class={type === 'header' ? 'phr-header' : 'phr-footer'}
  style="height: {type === 'header'
    ? getHeaderHeight(pageMargins)
    : getFooterHeight(pageMargins)}"
>
  {#if content}
    <ContentRenderer node={content} />
  {/if}
</div>

<style>
  .phr-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .phr-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>
