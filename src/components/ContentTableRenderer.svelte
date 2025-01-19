<script lang="ts">
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
  class:phr-noBorders={node.layout === 'noBorders'}
  class:phr-headerLineOnly={node.layout === 'headerLineOnly'}
  class:phr-lightHorizontalLines={node.layout === 'lightHorizontalLines'}
  class:phr-noSidePadding={node.layout === 'noBorders' ||
    node.layout === 'headerLineOnly' ||
    node.layout === 'lightHorizontalLines'}
>
  <tbody>
    {#each node.table?.body ?? [] as tr, rowIndex}
      <tr
        class:phr-header={(node.table.headerRows ?? -1) === rowIndex + 1 &&
          rowIndex < (node.table?.body.length ?? 0) - 1}
      >
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
  </tbody>
</table>

<style>
  td {
    border: 1pt solid #000;
    padding: 2pt 4pt;
    vertical-align: top;
    background: rgba(var(--fill-color), var(--fill-opacity, 0));
  }
  table {
    border-collapse: collapse;
    text-indent: inherit;
  }

  /* table layouts */

  .phr-noSidePadding > tbody > tr > td:first-child {
    padding-left: 0;
  }
  .phr-noSidePadding > tbody > tr > td:last-child {
    padding-right: 0;
  }

  .phr-noBorders > tbody > tr > td {
    border: none;
  }

  .phr-headerLineOnly > tbody > .phr-header {
    border-bottom: 2pt solid #000;
  }

  .phr-headerLineOnly > tbody > tr > td {
    border: none;
    padding-left: 8pt;
    padding-right: 8pt;
  }

  .phr-lightHorizontalLines > tbody > .phr-header > td {
    border-bottom-width: 2pt;
  }

  .phr-lightHorizontalLines > tbody > tr > td {
    border-left: none;
    border-right: none;
    border-top: none;
    border-bottom-color: #aaa;
    padding-left: 8pt;
    padding-right: 8pt;
  }

  .phr-lightHorizontalLines > tbody > tr:first-child > td {
    border-bottom-color: #000;
  }

  .phr-lightHorizontalLines > tbody > tr:last-child > td {
    border-bottom: none;
  }
</style>
