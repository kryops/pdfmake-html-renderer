<script type="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'

  import PdfmakeHtmlRenderer from '../src/PdfmakeHtmlRenderer.svelte'
  import PdfmakePreview from './PdfmakePreview.svelte'

  let document: TDocumentDefinitions | null = null

  let content = `{
  content: [
    'First paragraph',
    'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines','First paragraph',
  ]
}`

  let pdfmakeEnabled = false
  let errorMessage: string | null = null

  $: (() => {
    try {
      document = eval(`(${content});`)
      errorMessage = null
    } catch (error) {
      console.error
      errorMessage = error.message ?? String(error)
    }
  })()
</script>

<div class="container">
  <div class="header">
    <h1>pdfmake-html-renderer</h1>
    <span class="link" on:click={() => (pdfmakeEnabled = !pdfmakeEnabled)}
      >{pdfmakeEnabled ? 'Hide' : 'Show'} pdfmake preview</span
    >
    <a
      class="link"
      href="https://github.com/kryops/pdfmake-html-renderer"
      target="_blank">GitHub</a
    >
  </div>
  <div class="content">
    <div class="column">
      <textarea bind:value={content} />
    </div>
    <div class="column">
      {#if errorMessage}
        <div class="error">{errorMessage}</div>
      {:else if document}
        <div class="renderer">
          <PdfmakeHtmlRenderer {document} pageShadow={false} />
        </div>
        {#if pdfmakeEnabled}
          <PdfmakePreview {document} />
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    flex: 0;
    display: flex;
    align-items: center;
  }

  h1 {
    padding: 1rem;
    margin: 0;
    font-size: 1rem;
    font-weight: normal;
    flex-grow: 1;
  }

  .link {
    padding: 1rem;
    color: inherit;
    text-decoration: none;
  }

  .link:hover {
    background: #ddd;
  }

  .content {
    flex: 1 1 auto;
    display: flex;
  }

  .column {
    width: 50%;
    flex: 0 0 50%;
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
  }

  .renderer {
    flex: 1 1 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  textarea {
    border: none;
    flex: 1 1 auto;
  }

  .error {
    background: #ffaaaa;
    padding: 1rem;
  }
</style>
