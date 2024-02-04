import type { ContentQr } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleString } from './utils'

export function getQrStyleString(node: ContentQr, src: string) {
  const style: CssDictionary = {}

  // we roughly try to match pdfmake's sizing
  const defaultZoom = 5
  const naturalWidth =
    parseInt(decodeURIComponent(src).match(/viewBox="0 0 (\d+) (\d+)"/i)![1]) *
    defaultZoom

  const naturalPadding = ((node as any).padding ?? 0) * defaultZoom

  if (node.fit) {
    const padding = naturalPadding * (node.fit / naturalWidth)

    Object.assign(style, {
      // pdfmake seems to shrink the QR code by certain fixed factors and is often actually smaller
      width: node.fit + 'pt',
      height: node.fit + 'pt',
      padding: padding + 'pt',
    })
  } else {
    Object.assign(style, {
      width: naturalWidth + 'pt',
      height: naturalWidth + 'pt',
      padding: naturalPadding + 'pt',
    })
  }

  return getStyleString(style)
}
