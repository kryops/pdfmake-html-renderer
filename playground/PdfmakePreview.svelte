<script lang="ts">
  import pdfmake from 'pdfmake/build/pdfmake.min'
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { vfs } from './pdfmake/vfs_fonts'
  import { onDestroy } from 'svelte'

  interface Props {
    document: TDocumentDefinitions
  }

  let { document }: Props = $props()
  let renderedDocument: TDocumentDefinitions
  let blobUrl: string | undefined = $state(undefined)

  let timer: any

  async function createPdfBlob() {
    if (renderedDocument === document) return
    renderedDocument = document

    pdfmake.vfs = vfs

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      blobUrl = undefined
    }
    const pdfContent = pdfmake.createPdf(document)
    const blob = await new Promise<Blob>(resolve => {
      pdfContent.getBlob(resolve)
    })
    blobUrl = URL.createObjectURL(blob)
  }

  $effect(() => {
    document // we access the document to ensure that changes will call this function
    clearTimeout(timer)
    timer = setTimeout(createPdfBlob, 1000)
  })

  onDestroy(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl)
  })
</script>

<iframe src={blobUrl} title="pdfmake preview"></iframe>

<style>
  iframe {
    flex: 1 1 0;
    border: none;
  }
</style>
