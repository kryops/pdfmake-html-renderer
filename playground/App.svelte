<script lang="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import type { Example } from './examples'

  import PdfmakeHtmlRenderer from '../src/PdfmakeHtmlRenderer.svelte'
  import Editor from './Editor.svelte'
  import { examples } from './examples'
  import PdfmakePreview from './PdfmakePreview.svelte'

  import { version } from '../package.json'

  let activeExample: Example | null = $state(null)
  let document: TDocumentDefinitions | null = $state(null)

  const sessionKey = 'pdfmakeHtmlRendererPlaygroundContent'

  let content = $state(sessionStorage.getItem(sessionKey) ?? examples[0].code)

  let pdfmakeEnabled = $state(false)
  let errorMessage: string | null = $state(null)

  /**
   * We could do this on every keypress, but this would lead to errors
   * very often when typing JavaScript syntax
   */
  function updateDocument() {
    try {
      if (content.trim().startsWith('{')) {
        document = new Function(`return (${content});`)()
      } else {
        document = new Function(`${content}\nreturn dd;`)()
      }
      errorMessage = null
    } catch (error) {
      errorMessage = (error as any).message ?? String(error)
      console.error(errorMessage)
    }
  }

  let timer: any

  $effect(() => {
    sessionStorage.setItem(sessionKey, content)
    clearTimeout(timer)
    timer = setTimeout(updateDocument, 250)
  })
</script>

<div class="container">
  <div class="header">
    <h1>
      pdfmake-html-renderer &nbsp;
      <small>v{version}</small>
    </h1>
    <span>
      <select
        bind:value={activeExample}
        onchange={() => {
          if (activeExample) content = activeExample.code
        }}
      >
        <option value={null}></option>
        {#each examples as example}
          <option value={example}>
            {example.name}
          </option>
        {/each}
      </select>
    </span>
    <span class="link" onclick={() => (pdfmakeEnabled = !pdfmakeEnabled)}
      >{pdfmakeEnabled ? 'Hide' : 'Show'} pdfmake preview</span
    >
    <a
      class="link"
      href="https://github.com/kryops/pdfmake-html-renderer"
      target="_blank"
      rel="noreferrer">GitHub</a
    >
  </div>
  <div class="content">
    <div class="column">
      <Editor bind:content />
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

  select {
    font-size: 1rem;
    padding: 0.25rem;
  }

  .link {
    padding: 1rem;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
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

  .error {
    background: #ffaaaa;
    padding: 1rem;
  }
</style>
