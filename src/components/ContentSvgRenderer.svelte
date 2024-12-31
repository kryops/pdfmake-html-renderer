<script lang="ts">
  import type { ContentSvg } from 'pdfmake/interfaces'
  import { getImageStyleString } from '../styling/image'

  interface Props {
    node: ContentSvg;
  }

  let { node }: Props = $props();

  let src = $derived('data:image/svg+xml,' + encodeURIComponent(node.svg))
</script>

<img {src} alt="" style={getImageStyleString(node)} />

<style>
  img {
    display: block;
  }
</style>
