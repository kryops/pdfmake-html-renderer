<script lang="ts">
  import type { ContentQr } from 'pdfmake/interfaces'
  import { buildQrCode } from '../logic/qr'
  import { getQrStyleString } from '../styling/qr'

  export interface Props {
    node: ContentQr
  }

  let { node }: Props = $props()

  let src = $derived(buildQrCode(node))
</script>

<img {src} alt="" style={getQrStyleString(node, src)} />

<style>
  img {
    display: inline-block;
  }
</style>
