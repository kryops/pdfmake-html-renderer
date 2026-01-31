<script lang="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'
  import {
    getPageStyleString,
    getPageContentStyleString,
  } from '../styling/page'
  import type { PageSizeMode } from '../styling/page'
  import HeaderFooterRenderer from './HeaderFooterRenderer.svelte'
  import BackgroundRenderer from './BackgroundRenderer.svelte'
  import WatermarkRenderer from './WatermarkRenderer.svelte'

  export let document: TDocumentDefinitions
  export let pageShadow: boolean
  export let mode: PageSizeMode

  let clientWidth: number
</script>

<div bind:clientWidth class="phr-container">
  <div
    class="phr-page"
    class:phr-pageShadow={pageShadow}
    style={getPageStyleString(document, clientWidth, mode)}
  >
    {#if document.background}
      <BackgroundRenderer node={document.background} />
    {/if}
    <div class="phr-pageContent" style={getPageContentStyleString(document)}>
      {#if document.header}
        <HeaderFooterRenderer
          type="header"
          node={document.header}
          pageMargins={document.pageMargins}
        />
      {/if}
      {#if document.content}
        <ContentRenderer node={document.content} />
      {/if}
      {#if document.footer}
        <HeaderFooterRenderer
          type="footer"
          node={document.footer}
          pageMargins={document.pageMargins}
        />
      {/if}
      {#if document.watermark}
        <WatermarkRenderer node={document.watermark} />
      {/if}
    </div>
  </div>
</div>

<style>
  .phr-container {
    max-width: 100%;
  }
  .phr-page {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: auto;
    box-sizing: border-box;
    background: #fff;
    font-family: Roboto, Helvetica, sans-serif;
    font-size: 12pt;
    --font-size: 12pt;
    font-weight: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-decoration: none;
    overflow: hidden;
  }
  .phr-pageShadow {
    box-shadow: 0 0 2em #333;
  }
  .phr-pageContent {
    position: relative;
    flex: 1 1 auto;
    z-index: 1;
  }
</style>
