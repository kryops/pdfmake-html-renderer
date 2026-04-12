<script lang="ts">
  import type { ContentStack } from 'pdfmake/interfaces'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'

  export interface Props {
    node: ContentStack
  }

  let { node }: Props = $props()
</script>

<ContentArrayRenderer node={node.stack} />
