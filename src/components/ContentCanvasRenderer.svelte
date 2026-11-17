<script lang="ts">
  import type { ContentCanvas } from 'pdfmake/interfaces'
  import { getDocument } from '../context'
  import { getPatternElement } from '../styling/pattern'
  import {
    getCanvasEllipseProperties,
    getCanvasLineProperties,
    getCanvasPolylineProperties,
    getCanvasProperties,
    getCanvasRectProperties,
  } from '../styling/canvas'

  export interface Props {
    node: ContentCanvas
  }

  let { node }: Props = $props()

  // gradient IDs need to be unique within the whole document
  const uid = $props.id()

  const document = $derived(getDocument())
</script>

<div class="phr-media">
<svg {...getCanvasProperties(node)}>
  <defs>
    {#each node.canvas as element, elementIndex}
      {#if 'linearGradient' in element && element.linearGradient?.length}
        <linearGradient id="{uid}-gradient{elementIndex}">
          {#each element.linearGradient as stopColor, stopIndex}
            <stop
              offset="{(stopIndex /
                ((element.linearGradient?.length ?? 1) - 1)) *
                100}%"
              stop-color={stopColor}
              stop-opacity={element.fillOpacity}
            />
          {/each}
        </linearGradient>
      {:else if 'color' in element && Array.isArray(element.color)}
        {@html getPatternElement(
          `${uid}-gradient${elementIndex}`,
          element.color as [string, string],
          document.patterns,
          element.fillOpacity
        )}
      {/if}
    {/each}
  </defs>
  {#each node.canvas as element, index}
    {#if element.type === 'rect'}
      <rect {...getCanvasRectProperties(element, `${uid}-gradient${index}`)} />
    {:else if element.type === 'ellipse'}
      <ellipse {...getCanvasEllipseProperties(element, `${uid}-gradient${index}`)} />
    {:else if element.type === 'line'}
      <line {...getCanvasLineProperties(element)} />
    {:else if element.type === 'polyline'}
      <polyline {...getCanvasPolylineProperties(element, `${uid}-gradient${index}`)} />
    {/if}
  {/each}
</svg>
</div>

<style>
  .phr-media {
    display: block;
    line-height: 0;
  }

  svg {
    display: inline-block;
    vertical-align: top;
    overflow: visible;
  }
</style>
