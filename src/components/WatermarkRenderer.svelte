<script lang="ts">
  import type { Watermark } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getWatermarkStyleString } from '../styling/watermark'

  export interface Props {
    node: string | Watermark
  }

  let { node }: Props = $props()
  let text = $derived(typeof node === 'object' && node ? node.text : node)
  const document = $derived(getDocument())
</script>

<span class="phr-watermark" style={getWatermarkStyleString(node, document)}>
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
    /* pdfmake only inherits the font from the defaultStyle */
    font-weight: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-decoration: none;
    text-indent: 0;
    white-space: nowrap;
    z-index: 2;
    /* click through */
    pointer-events: none;
  }
</style>
