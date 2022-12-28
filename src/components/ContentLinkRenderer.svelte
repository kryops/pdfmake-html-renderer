<script lang="ts">
  import type { ContentText } from 'pdfmake/interfaces'
  import ContentRenderer from './ContentRenderer.svelte'

  // cannot use ContentLink as it is only a sub-type that ContentRenderer won't accept
  export let node: ContentText
</script>

<a
  href={node.link ?? '#' + node.linkToDestination}
  target={node.link ? '_blank' : undefined}
>
  <ContentRenderer {node} inline inLink />
</a>

<style>
  a {
    color: inherit;
    text-decoration: none;
  }
</style>
