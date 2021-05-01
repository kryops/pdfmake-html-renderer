<script type="ts">
  import type { ContentUnorderedList } from 'pdfmake/interfaces'
  import { tick } from 'svelte'
  import { getListItemsToRender } from '../logic/list'
  import {
    getUnorderedListEntryStyleString,
    getUnorderedListStyleString,
  } from '../styling/list'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: ContentUnorderedList

  $: entriesToRender = getListItemsToRender(node.ul)
</script>

<ul style={getUnorderedListStyleString(node)}>
  {#each entriesToRender as [entry, nextEntry]}
    <li style={getUnorderedListEntryStyleString(entry)}>
      <ContentRenderer node={entry} />
      {#if nextEntry}
        <ContentRenderer node={nextEntry} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style-type: disc;
    margin: 0;
    padding-left: 1em;
  }

  li::marker {
    color: var(--marker-color);
  }
</style>
