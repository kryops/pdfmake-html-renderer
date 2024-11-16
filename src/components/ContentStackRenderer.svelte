<script lang="ts">
  import type { ContentStack } from 'pdfmake/interfaces'
  import ContentArrayRenderer from './ContentArrayRenderer.svelte'

  interface Props {
    node: ContentStack;
  }

  let { node }: Props = $props();
</script>

<ContentArrayRenderer node={node.stack} />
