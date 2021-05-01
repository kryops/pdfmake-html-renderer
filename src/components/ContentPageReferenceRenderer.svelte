<script type="ts">
  import type { ContentPageReference } from 'pdfmake/interfaces'
  import { getDocumentNodes } from '../context'
  import { getReferenceText } from '../logic/reference'

  export let node: ContentPageReference

  const nodes = getDocumentNodes()
</script>

<a
  href="#{node.pageReference}"
  title={getReferenceText(node.pageReference, $nodes)}>X</a
>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
