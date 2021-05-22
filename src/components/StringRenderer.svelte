<script type="ts">
  export let node: string | number

  /**
   * - don't render empty strings
   * - force a space when string starts with space
   * - if string contains only spaces, only render a single forced space
   */
  function convertNode(n: string | number) {
    if (typeof n !== 'string') return n;

    if (!n.startsWith(' ')) return n;
    if (/^ +$/.test(n)) return '';
    return n.slice(1);
  }
</script>

<span>{#if typeof node === 'string' && node.startsWith(' ')}&nbsp;{/if}{convertNode(node)}</span>

<style>
  span {
    white-space: var(--white-space, pre-line);
  }
</style>
