<script lang="ts">
  import type { ContentSvg } from 'pdfmake/interfaces'
  import { getImageStyleString } from '../styling/image'

  interface Props {
    node: ContentSvg
  }

  let { node }: Props = $props()

  let container: HTMLDivElement | undefined = $state()

  let src = $derived(
    typeof node.svg === 'string'
      ? 'data:image/svg+xml,' +
          encodeURIComponent(
            node.svg.indexOf('xmlns') === -1
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
