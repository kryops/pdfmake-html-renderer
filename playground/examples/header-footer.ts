export default `{
  header: 'Header',
  content: 'Content',
  footer: (currentPage, pageCount) => ({
    text: \`\${currentPage}/\${pageCount}\`,
    alignment: 'right',
  }),
  pageMargins: [100, 100],
  pageSize: 'A6',
}`
