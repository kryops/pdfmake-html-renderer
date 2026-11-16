<script lang="ts">
  import type { ContentImage } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getImageStyleString } from '../styling/image'

  export interface Props {
    node: ContentImage
  }

  let { node }: Props = $props()

  const document = $derived(getDocument())
  let image = $derived(document.images?.[node.image])
  let src = $derived(
    (typeof image === 'object' ? image.url : image) ?? node.image
  )
</script>

<div class="phr-media">
  <img {src} alt="" style={getImageStyleString(node)} />
</div>

<style>
  /* Inline content, so that the inherited text-align (alignment) applies.
     The line height is 0 to prevent a gap below the image. */
  .phr-media {
    display: block;
    line-height: 0;
  }

  img {
    display: inline-block;
    vertical-align: top;
  }
</style>
