<script lang="ts">
  import type { ContentSection } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getDocument, getDocumentNodes } from '../context'
  import { getInheritedPageMargins } from '../logic/section'
  import {
    getMarginString,
    getNegativeHorizontalMarginString,
  } from '../styling/margin'
  import { getStyleString } from '../styling/utils'
  import HeaderFooterRenderer from './HeaderFooterRenderer.svelte'
  import WatermarkRenderer from './WatermarkRenderer.svelte'
  import BackgroundRenderer from './BackgroundRenderer.svelte'

  export interface Props {
    node: ContentSection
  }

  let { node }: Props = $props()

  const document = $derived(getDocument())
  const nodes = $derived(getDocumentNodes())

  let margins = $derived(
    (node.pageMargins === 'inherit'
      ? getInheritedPageMargins(nodes, node)
      : node.pageMargins) ?? undefined
  )
</script>

<hr />

<div
  style={getStyleString({
    margin: getNegativeHorizontalMarginString(document.pageMargins, 40),
    padding: getMarginString(margins, 40),
  })}
>
  {#if node.background && node.background !== 'inherit'}
    <BackgroundRenderer node={node.background} />
  {/if}

  {#if node.header && node.header !== 'inherit'}
    <HeaderFooterRenderer
      type="header"
      node={node.header}
      pageMargins={margins}
    />
  {/if}

  <ContentRenderer node={node.section} />

  {#if node.footer && node.footer !== 'inherit'}
    <HeaderFooterRenderer
      type="footer"
      node={node.footer}
      pageMargins={margins}
    />
  {/if}

  {#if node.watermark && node.watermark !== 'inherit'}
    <WatermarkRenderer node={node.watermark} />
  {/if}
</div>

<style>
  hr {
    border-style: dashed;
  }
  div {
    position: relative;
  }
</style>
