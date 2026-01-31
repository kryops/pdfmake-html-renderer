<script lang="ts">
  import type { ContentSvg } from 'pdfmake/interfaces'
  import { getImageStyleString } from '../styling/image'

  export let node: ContentSvg

  let container: HTMLDivElement

  $: src =
    typeof node.svg === 'string'
      ? 'data:image/svg+xml,' + encodeURIComponent(node.svg)
      : undefined

  $: if (
    typeof SVGElement !== 'undefined' &&
    node.svg instanceof SVGElement &&
    container
  ) {
    container.innerHTML = ''
    container.appendChild(node.svg.cloneNode(true))
  }
</script>

{#if src}
  <img {src} alt="" style={getImageStyleString(node)} />
{:else}
  <div bind:this={container}></div>
{/if}

<style>
  img {
    display: block;
  }

  div {
    display: inline;
  }

  div :global(svg) {
    display: block;
  }
</style>
