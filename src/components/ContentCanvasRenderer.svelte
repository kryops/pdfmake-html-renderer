<script lang="ts">
  import type { ContentCanvas } from 'pdfmake/interfaces'
  import {
    getCanvasEllipseProperties,
    getCanvasLineProperties,
    getCanvasPolylineProperties,
    getCanvasProperties,
    getCanvasRectProperties,
  } from '../styling/canvas'

  export let node: ContentCanvas
</script>

<svg {...getCanvasProperties(node)}>
  <defs>
    {#each node.canvas as element, elementIndex}
      {#if 'linearGradient' in element && element.linearGradient?.length}
        <linearGradient id="gradient{elementIndex}">
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
      {/if}
    {/each}
  </defs>
  {#each node.canvas as element, index}
    {#if element.type === 'rect'}
      <rect {...getCanvasRectProperties(element, index)} />
    {:else if element.type === 'ellipse'}
      <ellipse {...getCanvasEllipseProperties(element, index)} />
    {:else if element.type === 'line'}
      <line {...getCanvasLineProperties(element)} />
    {:else if element.type === 'polyline'}
      <polyline {...getCanvasPolylineProperties(element, index)} />
    {/if}
  {/each}
</svg>

<style>
  svg {
    display: block;
    overflow: visible;
  }
</style>
