<svelte:options accessors={true} />

<script type="ts">
  import PdfmakeHtmlRenderer from '../src/PdfmakeHtmlRenderer.svelte'
  import { testDocument } from './test-document'

  let document = testDocument
</script>

<PdfmakeHtmlRenderer {document} />
