<script type="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import { getPageStyleString } from '../styling/page'
  import type { PageSizeMode } from '../styling/page'
  import HeaderFooterRenderer from './HeaderFooterRenderer.svelte'
  import { getFooterHeight, getHeaderHeight } from '../styling/header'
  import BackgroundRenderer from './BackgroundRenderer.svelte'
  import WatermarkRenderer from './WatermarkRenderer.svelte'

  export let document: TDocumentDefinitions
  export let pageShadow: boolean
  export let mode: PageSizeMode

  let clientWidth: number
</script>

<div bind:clientWidth class="container">
  <div
    class="page"
    class:pageShadow
    style={getPageStyleString(document, clientWidth, mode)}
  >
    {#if document.background}
      <div class="backgroundLayer">
        <BackgroundRenderer node={document.background} />
      </div>
    {/if}
    {#if document.header}
      <div class="header" style="height: {getHeaderHeight(document)}">
        <HeaderFooterRenderer node={document.header} />
      </div>
    {/if}
    {#if document.content}
      <ContentRenderer node={document.content} />
    {/if}
    {#if document.footer}
      <div class="footer" style="height: {getFooterHeight(document)}">
        <HeaderFooterRenderer node={document.footer} />
      </div>
    {/if}
    {#if document.watermark}
      <WatermarkRenderer node={document.watermark} />
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 100%;
  }
  .page {
    position: relative;
    margin: auto;
    box-sizing: border-box;
    background: #fff;
    font-family: Roboto, Helvetica, sans-serif;
    overflow: hidden;
  }
  .pageShadow {
    box-shadow: 0 0 2em #333;
  }
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .backgroundLayer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
