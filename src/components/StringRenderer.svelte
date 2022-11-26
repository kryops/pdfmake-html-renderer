<script type="ts">
  export let node: string | number
  export let first = true
  export let last = true

  function trimText() {
    if (typeof node !== 'string') return node
    if (!first && !last) return node

    let text = node
    // we cannot just trim(), as we need to preserve newlines
    if (first) text = text.replace(/^(\n*) +/, '$1')
    if (last) text = text.replace(/ +$/, '')

    // spaces can be used to create empty lines
    if (node !== '' && text === '') return ' '

    return text
  }
</script>

<span>{trimText()}</span>

<style>
  span {
    white-space: var(--white-space, pre-wrap);
  }
</style>
