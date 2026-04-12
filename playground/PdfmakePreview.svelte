<script lang="ts">
  import pdfmake from 'pdfmake/build/pdfmake.min'
  import vfs from 'pdfmake/build/vfs_fonts'
  import type { TDocumentDefinitions } from 'pdfmake/interfaces'
  import { onDestroy, onMount } from 'svelte'
  import { evaluateDocument } from './utils'

  export interface Props {
    // cannot take the original document, as pdfmake mutates it, and we cannot clone easily with contained functions
    content: string
  }

  let { content }: Props = $props()
  let renderedContent: string
  let blobUrl: string | undefined = $state(undefined)
  let timer: any // no $state, leads to infinite loop in effect!

  async function createPdfBlob() {
    if (renderedContent === content) return
    renderedContent = content

    pdfmake.addVirtualFileSystem(vfs)

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      blobUrl = undefined
    }
    const document = evaluateDocument(content)
    const pdfContent = pdfmake.createPdf(document)
    const blob = await pdfContent.getBlob()
    blobUrl = URL.createObjectURL(blob)
  }

  onMount(createPdfBlob)

  $effect(() => {
    content // we access the content to ensure that changes will call this function
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
