<script lang="ts">
  import type { ContentImage } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getImageStyleString } from '../styling/image'

  interface Props {
    node: ContentImage;
  }

  let { node }: Props = $props();

  const document = getDocument()
  let image = $derived($document.images?.[node.image])
  let src = $derived((typeof image === 'object' ? image.url : image) ?? node.image)
</script>

<img {src} alt="" style={getImageStyleString(node)} />

<style>
  img {
    display: block;
  }
</style>
