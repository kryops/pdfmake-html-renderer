<script lang="ts">
  import PdfmakeHtmlRenderer from 'pdfmake-html-renderer'
</script>

<PdfmakeHtmlRenderer
  document={{
    content: [
      {
        text: 'pdfmake-html-renderer React Example',
        fontSize: 18,
        bold: true,
      },
      '\n',
      'Hello, world!',
    ],
  }}
/>
