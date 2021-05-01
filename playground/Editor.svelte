<script type="ts">
  import type { Ace } from 'ace-builds'

  import 'ace-builds/src-min-noconflict/ace'
  import 'ace-builds/src-min-noconflict/mode-javascript'

  import { onDestroy, onMount } from 'svelte'

  export let content: string

  let div: HTMLDivElement
  let editor: Ace.Editor

  onMount(() => {
    editor = ace.edit(div, {
      mode: 'ace/mode/javascript',
      value: content,
      wrap: true,
      useWorker: false,
    })

    editor.on('change', () => (content = editor.getValue()))
  })

  onDestroy(() => editor.destroy())
</script>

<div class="editor" bind:this={div} />

<style>
  .editor {
    flex: 1 1 auto;
  }
</style>
