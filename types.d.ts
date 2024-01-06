declare module 'qrcode/build/qrcode.min' {
  const qrcode: typeof import('qrcode')
  export default qrcode
}

declare module 'pdfmake/build/pdfmake.min' {
  const pdfmake: typeof import('pdfmake/build/pdfmake')
  export default pdfmake
}

declare var ace: typeof import('ace-builds')
