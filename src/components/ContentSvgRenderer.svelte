<script type="ts">
  import type { ContentSvg } from 'pdfmake/interfaces'
  import { getImageStyleString } from '../styling/image'

  export let node: ContentSvg

  $: src = 'data:image/svg+xml,' + encodeURIComponent(node.svg)
</script>

<img {src} alt="" style={getImageStyleString(node)} />

<style>
  img {
    display: block;
  }
</style>
