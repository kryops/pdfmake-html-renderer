<script lang="ts">
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
      fontSize: 16,
    })

    editor.on('change', () => (content = editor.getValue()))
  })

  $: if (editor && editor.getValue() !== content) editor.setValue(content)

  onDestroy(() => editor.destroy())
</script>

<div class="editor" bind:this={div} />

<style>
  .editor {
    flex: 1 1 auto;
  }
</style>
