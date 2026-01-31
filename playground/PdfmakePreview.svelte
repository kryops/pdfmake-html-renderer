<script lang="ts">
  import pdfmake from 'pdfmake/build/pdfmake.min'
  import vfs from 'pdfmake/build/vfs_fonts'
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { onDestroy, onMount } from 'svelte'

  export let document: TDocumentDefinitions
  let renderedDocument: TDocumentDefinitions
  let blobUrl: string | undefined = undefined
  let timer: any

  async function createPdfBlob() {
    if (renderedDocument === document) return
    renderedDocument = document

    pdfmake.addVirtualFileSystem(vfs)

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      blobUrl = undefined
    }
    const pdfContent = pdfmake.createPdf(document)
    const blob = await pdfContent.getBlob()
    blobUrl = URL.createObjectURL(blob)
  }

  onMount(createPdfBlob)

  $: (() => {
    document // we access the document to ensure that changes will call this function
    clearTimeout(timer)
    timer = setTimeout(createPdfBlob, 1000)
  })()

  onDestroy(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl)
  })
</script>

<iframe src={blobUrl} title="pdfmake preview" />

<style>
  iframe {
    flex: 1 1 0;
    border: none;
  }
</style>
