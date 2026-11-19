<script lang="ts">
  import type { ContentSvg } from 'pdfmake/interfaces'
  import { getImageStyleString, getSvgSize } from '../styling/image'

  export interface Props {
    node: ContentSvg
  }

  let { node }: Props = $props()

  let container: HTMLDivElement | undefined = $state()

  let src = $derived(
    typeof node.svg === 'string'
      ? 'data:image/svg+xml,' +
          encodeURIComponent(
            !/<svg\b[^>]*\sxmlns\s*=/i.test(node.svg)
              ? node.svg.replace(
                  '<svg',
                  '<svg xmlns="http://www.w3.org/2000/svg"'
                )
              : node.svg
          )
      : undefined
  )

  $effect(() => {
    if (
      typeof SVGElement !== 'undefined' &&
      node.svg instanceof SVGElement &&
      container
    ) {
      container.innerHTML = ''
      container.appendChild(node.svg.cloneNode(true))
    }
  })
</script>

<div class="phr-media">
  {#if src}
    <img
      {src}
      alt=""
      style={getImageStyleString(
        node,
        typeof node.svg === 'string' ? getSvgSize(node.svg) : undefined
      )}
    />
  {:else}
    <div class="phr-svgContainer" bind:this={container}></div>
  {/if}
</div>

<style>
  .phr-media {
    display: block;
    line-height: 0;
  }

  img {
    display: inline-block;
    vertical-align: top;
  }

  .phr-svgContainer {
    display: inline;
  }

  .phr-svgContainer :global(svg) {
    display: inline-block;
    vertical-align: top;
  }
</style>
