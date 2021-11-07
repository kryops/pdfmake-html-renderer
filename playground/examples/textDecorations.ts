// https://github.com/bpampuch/pdfmake/blob/master/examples/textDecorations.js
export default `var ct = []

ct.push({ text: 'Higlighted text', fontSize: 18, background: 'yellow' })
ct.push(' ')
ct.push({
  columns: [
    { text: 'Underline decoration', decoration: 'underline' },
    { text: 'Line Through decoration', decoration: 'lineThrough' },
    { text: 'Overline decoration', decoration: 'overline' },
  ],
})
ct.push(' ')
ct.push({
  columns: [
    {
      text: 'Dashed style',
      decoration: 'underline',
      decorationStyle: 'dashed',
    },
    {
      text: 'Dotted style',
      decoration: 'underline',
      decorationStyle: 'dotted',
    },
    {
      text: 'Double style',
      decoration: 'underline',
      decorationStyle: 'double',
    },
    { text: 'Wavy style', decoration: 'underline', decorationStyle: 'wavy' },
  ],
})
ct.push(' ')
ct.push({
  columns: [
    { text: 'Using colors', decoration: 'underline', decorationColor: 'blue' },
    { text: 'Using colors', decoration: 'lineThrough', decorationColor: 'red' },
    {
      text: 'Using colors',
      decoration: 'underline',
      decorationStyle: 'wavy',
      decorationColor: 'green',
    },
  ],
})

const dd = {
  content: ct,
}`
