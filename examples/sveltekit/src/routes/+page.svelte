<script lang="ts">
  import 'pdfmake-html-renderer/dist/index.css'

  import PdfmakeHtmlRenderer from 'pdfmake-html-renderer'
</script>

<PdfmakeHtmlRenderer
  document={{
    content: [
      {
        text: 'pdfmake-html-renderer SvelteKit Example',
        fontSize: 18,
        bold: true,
      },
      '\n',
      'Hello, world!',
    ],
  }}
/>
