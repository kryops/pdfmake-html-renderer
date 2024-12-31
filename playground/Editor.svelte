<script lang="ts">
  import type { Ace } from 'ace-builds'

  import 'ace-builds/src-min-noconflict/ace'
  import 'ace-builds/src-min-noconflict/mode-javascript'

  import { onDestroy, onMount } from 'svelte'

  interface Props {
    content: string
  }

  let { content = $bindable() }: Props = $props()

  let div: HTMLDivElement | undefined = $state()
  let editor: Ace.Editor | undefined = $state()

  onMount(() => {
    if (!div) throw new Error('Editor container not bound.')

    editor = ace.edit(div, {
      mode: 'ace/mode/javascript',
      value: content,
      wrap: true,
      useWorker: false,
      fontSize: 16,
    })

    editor.on('change', () => (content = editor!.getValue()))
  })

  $effect(() => {
    if (editor && editor.getValue() !== content) editor.setValue(content)
  })

  onDestroy(() => editor?.destroy())
</script>

<div class="editor" bind:this={div}></div>

<style>
  .editor {
    flex: 1 1 auto;
  }
</style>
