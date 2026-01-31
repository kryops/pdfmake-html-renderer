declare module 'qrcode/build/qrcode.min' {
  const qrcode: typeof import('qrcode')
  export default qrcode
}

declare var ace: typeof import('ace-builds')
