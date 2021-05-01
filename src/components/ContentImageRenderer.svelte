<script type="ts">
  import type { ContentImage } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getImageStyleString } from '../styling/image'

  export let node: ContentImage

  const document = getDocument()
  $: src = $document.images?.[node.image] ?? node.image
</script>

<img {src} alt="" style={getImageStyleString(node)} />

<style>
  img {
    display: block;
  }
</style>
