<script type="ts">
  import type { ContentTable } from 'pdfmake/interfaces'
  import {
    getTableCellsCoveredBySpans,
    isActualTableCell,
    shouldRenderCell,
  } from '../logic/table'
  import {
    getTableCellStyleString,
    getTableStyleString,
  } from '../styling/table'
  import ContentRenderer from './ContentRenderer.svelte'

  export let node: ContentTable

  $: coveredCells = getTableCellsCoveredBySpans(node)
</script>

<table
  style={getTableStyleString(node)}
  class:noBorders={node.layout === 'noBorders'}
  class:headerLineOnly={node.layout === 'headerLineOnly'}
  class:lightHorizontalLines={node.layout === 'lightHorizontalLines'}
  class:noSidePadding={node.layout === 'noBorders' ||
    node.layout === 'headerLineOnly' ||
    node.layout === 'lightHorizontalLines'}
>
  {#each node.table?.body ?? [] as tr, rowIndex}
    <tr class:header={(node.table.headerRows ?? -1) === rowIndex + 1}>
      {#each tr as td, columnIndex}
        {#if shouldRenderCell(td, rowIndex, columnIndex, coveredCells)}
          <td
            colspan={td.colSpan}
            rowspan={td.rowSpan}
            style={getTableCellStyleString(td, node, rowIndex, columnIndex)}
          >
            {#if isActualTableCell(td)}
              <ContentRenderer node={td} />
            {/if}
          </td>
        {/if}
      {/each}
    </tr>
  {/each}
</table>

<style>
  td {
    border: 1px solid #000;
    padding: 2pt 4pt;
    vertical-align: top;
    background: rgba(var(--fill-color), var(--fill-opacity, 0));
  }
  table {
    border-collapse: collapse;
  }

  /* table layouts */

  .noSidePadding > tr > td:first-child {
    padding-left: 0;
  }
  .noSidePadding > tr > td:last-child {
    padding-right: 0;
  }

  .noBorders > tr > td {
    border: none;
  }

  .headerLineOnly > .header {
    border-bottom: 2pt solid #000;
  }

  .headerLineOnly > tr > td {
    border: none;
    padding-left: 8pt;
    padding-right: 8pt;
  }

  .lightHorizontalLines > .header > td {
    border-bottom-width: 2pt;
  }

  .lightHorizontalLines > tr > td {
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom-color: #aaa;
    padding-left: 8pt;
    padding-right: 8pt;
  }

  .lightHorizontalLines > tr:first-child > td {
    border-bottom-color: #000;
  }

  .lightHorizontalLines > tr:last-child > td {
    border-bottom: none;
  }
</style>
