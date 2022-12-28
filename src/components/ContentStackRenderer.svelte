<script lang="ts">
  import type { ContentStack } from 'pdfmake/interfaces'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'

  export let node: ContentStack
</script>

<ContentArrayRenderer node={node.stack} />
