import type { ContentQr } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleString } from './utils'

export function getQrStyleString(node: ContentQr, src: string) {
  const style: CssDictionary = {}

  if (node.fit) {
    Object.assign(style, {
      width: node.fit + 'pt',
      height: node.fit + 'pt',
    })
  } else {
    // we roughly try to match pdfmake's sizing
    const width =
      parseInt(
        decodeURIComponent(src).match(/viewBox="0 0 (\d+) (\d+)"/i)![1]
      ) * 5
    Object.assign(style, {
      width: width + 'pt',
      height: width + 'pt',
    })
  }

  return getStyleString(style)
}
