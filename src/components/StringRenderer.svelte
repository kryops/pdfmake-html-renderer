<script lang="ts">
  export let node: string | number
  export let first = true
  export let last = true

  // Cannot reference node inside the function, as Svelte's reactivity won't re-render
  function trimText(myNode: string | number) {
    if (typeof myNode !== 'string') return myNode
    if (!first && !last) return myNode

    let text = myNode
    // we cannot just trim(), as we need to preserve newlines
    if (first) text = text.replace(/^(\n*) +/, '$1')
    if (last) text = text.replace(/ +$/, '')

    // spaces can be used to create empty lines
    if (myNode !== '' && text === '') return ' '

    return text
  }
</script>

<span>{trimText(node)}</span>

<style>
  span {
    white-space: var(--white-space, pre-wrap);
  }
</style>
