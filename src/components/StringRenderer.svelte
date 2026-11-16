<script lang="ts">
  export interface Props {
    node: string | number
    first?: boolean
    last?: boolean
  }

  let { node, first = true, last = true }: Props = $props()

  // Cannot reference node inside the function, as Svelte's reactivity won't re-render
  function trimText(myNode: string | number) {
    if (typeof myNode !== 'string') return myNode

    // pdfmake expands tabs to four spaces
    const expanded = myNode.replace(/\t/g, '    ')
    if (!first && !last) return expanded

    let text = expanded
    // we cannot just trim(), as we need to preserve newlines
    if (first) text = text.replace(/^(\n*) +/, '$1')
    if (last) text = text.replace(/ +$/, '')

    // spaces can be used to create empty lines
    if (expanded !== '' && text === '') return ' '

    return text
  }
</script>

<span>{trimText(node)}</span>

<style>
  span {
    white-space: var(--white-space, pre-wrap);
    /* only set when fragments override the decoration of their parent */
    text-decoration-line: var(--decoration-line, none);
    text-decoration-style: var(--decoration-style, solid);
    text-decoration-color: var(--decoration-color, currentcolor);
    text-decoration-thickness: var(--decoration-thickness, auto);
  }
</style>
