import type { ContentImage, ContentSvg } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleString } from './utils'

export function getImageStyleString(node: ContentImage | ContentSvg) {
  const style: CssDictionary = {}

  if (node.width) style.width = node.width + 'pt'
  if (node.height) style.height = node.height + 'pt'

  if (node.fit && Array.isArray(node.fit)) {
    const [maxWidth, maxHeight] = node.fit
    style['width'] = maxWidth + 'pt'
    style['max-height'] = maxHeight + 'pt'
    style['object-fit'] = 'contain'
    style['object-position'] = 'left top'
  } else if ('cover' in node && node.cover) {
    const { width, height, align, valign } = node.cover
    // pdfmake has clipping issues when width/height do not match cover.width/height
    if (width) style['width'] = width + 'pt'
    if (height) style['height'] = height + 'pt'
    style['object-fit'] = 'cover'
    style['object-position'] = `${align ?? 'center'} ${valign ?? 'center'}`
  }

  return getStyleString(style)
}
