<script type="ts">
  import type { Watermark } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getWatermarkStyleString } from '../styling/watermark'

  export let node: string | Watermark
  $: text = typeof node === 'object' ? node.text : node
  const document = getDocument()
</script>

<span class="watermark" style={getWatermarkStyleString(node, $document)}>
  {text}
</span>

<style>
  .watermark {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    color: #444;
    white-space: nowrap;
    /* click through */
    pointer-events: none;
  }
</style>
