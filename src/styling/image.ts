import type { ContentImage, ContentSvg } from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleString } from './utils'

type SizeConstraints = {
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

/**
 * pdfmake uses the pixel dimensions of images (and the width/height of SVGs)
 * as points, while browsers use them as CSS pixels.
 */
export const pxToPtZoom = 4 / 3

/** Reads the `width`/`height` (or `viewBox` as a fallback) of an SVG string */
export function getSvgSize(
  svg: string
): { width: number; height: number } | undefined {
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0]
  if (!tag) return undefined

  const attr = (name: string) =>
    parseFloat(
      tag.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ??
        ''
    )

  let width = attr('width')
  let height = attr('height')

  if (isNaN(width) || isNaN(height)) {
    const viewBox = tag
      .match(/\sviewBox\s*=\s*["']([^"']*)["']/i)?.[1]
      ?.trim()
      .split(/[\s,]+/)
      .map(parseFloat)
    if (viewBox?.length === 4) {
      if (isNaN(width)) width = viewBox[2]
      if (isNaN(height)) height = viewBox[3]
    }
  }

  return isNaN(width) || isNaN(height) ? undefined : { width, height }
}

export function getImageStyleString(
  node: ContentImage | ContentSvg,
  /** Natural size of the image in points, if known */
  naturalSize?: { width: number; height: number }
) {
  const style: CssDictionary = {}

  const { minWidth, maxWidth, minHeight, maxHeight } = node as SizeConstraints
  const hasConstraints = [minWidth, maxWidth, minHeight, maxHeight].some(
    value => typeof value === 'number'
  )
  const hasExplicitSize =
    !!node.width ||
    !!node.height ||
    (Array.isArray(node.fit) && node.fit.length > 0) ||
    ('cover' in node && !!node.cover)

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
  } else {
    if (typeof minWidth === 'number') style['min-width'] = minWidth + 'pt'
    if (typeof maxWidth === 'number') style['max-width'] = maxWidth + 'pt'
    if (typeof minHeight === 'number') style['min-height'] = minHeight + 'pt'
    if (typeof maxHeight === 'number') style['max-height'] = maxHeight + 'pt'

    // pdfmake keeps the aspect ratio when clamping
    if (hasConstraints && node.width && node.height) {
      delete style.height
    }

    if (!hasExplicitSize) {
      if (naturalSize) {
        // the height follows from the aspect ratio, which keeps clamping correct
        style.width = naturalSize.width + 'pt'
      } else if ('image' in node) {
        // Scales the natural size from pixels to points.
        // Lengths are scaled as well, so we need to compensate for the constraints.
        style.zoom = String(pxToPtZoom)
        for (const key of Object.keys(style)) {
          if (/^m(in|ax)-/.test(key)) {
            style[key] = parseFloat(style[key]) / pxToPtZoom + 'pt'
          }
        }
      }
    }
  }

  return getStyleString(style)
}
