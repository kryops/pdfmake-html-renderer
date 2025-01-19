<script lang="ts">
  import type { ContentQr } from 'pdfmake/interfaces'
  import { buildQrCode } from '../logic/qr'
  import { getQrStyleString } from '../styling/qr'

  interface Props {
    node: ContentQr;
  }

  let { node }: Props = $props();

  let qrCode = $derived(buildQrCode(node))
</script>

{#await qrCode then src}
  {#if src}
    <img {src} alt="" style={getQrStyleString(node, src)} />
  {/if}
{/await}

<style>
  img {
    display: inline-block;
  }
</style>
