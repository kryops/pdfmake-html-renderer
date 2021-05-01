<script type="ts">
  import type { ContentTextReference } from 'pdfmake/interfaces'
  import { getDocumentNodes } from '../context'
  import { getReferenceText } from '../logic/reference'

  export let node: ContentTextReference

  const nodes = getDocumentNodes()
</script>

<a href="#{node.textReference}">
  {getReferenceText(node.textReference, $nodes)}
</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
