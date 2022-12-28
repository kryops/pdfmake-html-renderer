<script lang="ts">
  import type { Watermark } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getWatermarkStyleString } from '../styling/watermark'

  export let node: string | Watermark
  $: text = typeof node === 'object' && node ? node.text : node
  const document = getDocument()
</script>

<span class="phr-watermark" style={getWatermarkStyleString(node, $document)}>
  {text ?? ''}
</span>

<style>
  .phr-watermark {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    color: #000;
    opacity: 0.6;
    white-space: nowrap;
    z-index: 2;
    /* click through */
    pointer-events: none;
  }
</style>
