<script lang="ts">
  import type { ContentOrderedList } from 'pdfmake/interfaces'
  import { getListItemsToRender } from '../logic/list'
  import {
    getOrderedListEntryStyleString,
    getOrderedListStyleString,
  } from '../styling/list'
  import ContentRenderer from './ContentRenderer.svelte'

  export interface Props {
    node: ContentOrderedList
  }

  let { node }: Props = $props()

  let entriesToRender = $derived(getListItemsToRender(node.ol))
</script>

<ol
  start={node.start}
  class:phr-reversed={node.reversed}
  style={getOrderedListStyleString(node)}
>
  {#each entriesToRender as [entry, nextEntry]}
    <li
      class:phr-customCounter={entry.counter != null}
      style={getOrderedListEntryStyleString(entry)}
    >
      <ContentRenderer node={entry} />
      {#if nextEntry}
        <ContentRenderer node={nextEntry} />
      {/if}
    </li>
  {/each}
</ol>

<style>
  ol {
    margin: 0;
    counter-reset: item;
  }

  li {
    counter-increment: item;
    position: relative;
  }

  ol.phr-reversed > li {
    counter-increment: item -1;
  }

  /* pdfmake left-aligns markers, while native markers are right-aligned */
  li::marker {
    content: '';
  }

  li::before {
    position: absolute;
    left: calc(-1 * var(--marker-width, 1.5em));
    white-space: nowrap;
    color: var(--marker-color);
    content: var(--separator1) counter(item, var(--list-type, decimal))
      var(--separator2);
  }

  .phr-customCounter::before {
    content: var(--separator1) counter(custom, var(--list-type, decimal))
      var(--separator2);
  }
</style>
