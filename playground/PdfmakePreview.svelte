<script lang="ts">
  import { run } from 'svelte/legacy';

  import pdfmake from 'pdfmake/build/pdfmake.min'
  import vfs from 'pdfmake/build/vfs_fonts'
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { onDestroy, onMount } from 'svelte'

  interface Props {
    document: TDocumentDefinitions;
  }

  let { document }: Props = $props();
  let renderedDocument: TDocumentDefinitions
  let blobUrl: string | undefined = $state(undefined)
  let timer: any = $state()

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

  run(() => {
    (() => {
      document // we access the document to ensure that changes will call this function
      clearTimeout(timer)
      timer = setTimeout(createPdfBlob, 1000)
    })()
  });

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
