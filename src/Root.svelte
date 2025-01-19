<script lang="ts">
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import PdfmakeHtmlRenderer from './PdfmakeHtmlRenderer.svelte'
  import type { PageSizeMode } from './styling/page'

  interface Props {
    document: TDocumentDefinitions
    pageShadow?: boolean
    mode?: PageSizeMode
  }

  let { document, pageShadow = true, mode = 'shrinkToFit' }: Props = $props()

  // This component is nothing but a simple wrapper around the PdfmakeHtmlRenderer.
  // However, it seems to be necessary to avoid effect_orphan errors when using mount().
</script>

{#if document}
  <PdfmakeHtmlRenderer {document} {pageShadow} {mode} />
{/if}
