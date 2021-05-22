import type { TDocumentDefinitions, Watermark } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getPageSize } from './page'
import { getStyleString } from './utils'

export function getWatermarkStyleString(
  node: string | Watermark,
  document: TDocumentDefinitions
) {
  const pageSize = getPageSize(document)
  const width =
    pageSize.orientation === 'landscape' ? pageSize.height : pageSize.width
  const height =
    pageSize.orientation === 'landscape' ? pageSize.width : pageSize.height
  const defaultAngle = Math.atan(height / width)
  const defaultDiagonal = Math.sqrt(width * width + height * height)

  const numCharacters =
    typeof node === 'string' ? node.length : node.text?.length ?? 0

  const angle =
    typeof node === 'object' && node && node.angle !== undefined
      ? ((360 - node.angle) * Math.PI) / 180
      : defaultAngle
  const diagonal = Math.min(Math.abs(width / Math.cos(angle)), defaultDiagonal)
  const fontSize = (diagonal / (numCharacters + 5)) * 1.75

  const style: CssDictionary = {
    'font-size': fontSize + 'pt',
    margin: `0 -${(diagonal - width) / 2}pt`,
    top: height / 2 - fontSize + 'pt',
    transform: `rotate(-${angle}rad)`,
  }

  if (typeof node === 'object' && node) {
    if (node.fontSize) {
      style['font-size'] = node.fontSize + 'pt'
      style['--font-size'] = node.fontSize + 'pt'
    }
    if (node.font) style['font-family'] = node.font
    if (node.bold) style['font-weight'] = 'bold'
    if (node.italics) style['font-style'] = 'italic'
    if (node.color) style['color'] = node.color
    if (node.opacity) style['opacity'] = String(node.opacity)
  }

  return getStyleString(style)
}
