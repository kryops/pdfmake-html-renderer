import type { Pattern, PatternFill } from 'pdfmake/interfaces'
import { colorToHex } from './utils'

/**
 * pdfmake patterns are defined as PDF content stream operators.
 * We support the common path-drawing subset and convert it to SVG.
 */

/** Converts a PDF content stream to SVG elements (pdfkit's y-axis points down, like SVG's) */
export function patternStreamToSvg(
  stream: string,
  patternColor: string
): string {
  const tokens = stream
    // dash arrays are not supported - treat the brackets as operands
    .replace(/[[\]]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  let operands: number[] = []
  let d = ''
  let lineWidth = 1
  let lineCap = 0
  let lineJoin = 0
  // pdfkit creates uncolored patterns, so color operators are ignored
  const fill = patternColor
  const stroke = patternColor
  let output = ''
  let currentX = 0
  let currentY = 0

  const paint = (doFill: boolean, doStroke: boolean, evenOdd = false) => {
    if (!d) return
    const attributes = [`d="${d.trim()}"`, `fill="${doFill ? fill : 'none'}"`]
    if (evenOdd) attributes.push('fill-rule="evenodd"')
    if (doStroke) {
      attributes.push(
        `stroke="${stroke}"`,
        `stroke-width="${lineWidth}"`,
        `stroke-linecap="${['butt', 'round', 'square'][lineCap] ?? 'butt'}"`,
        `stroke-linejoin="${['miter', 'round', 'bevel'][lineJoin] ?? 'miter'}"`
      )
    }
    output += `<path ${attributes.join(' ')}/>`
    d = ''
  }

  for (const token of tokens) {
    const num = Number(token)
    if (!Number.isNaN(num)) {
      operands.push(num)
      continue
    }

    const [a, b, c, e, f, g] = operands
    switch (token) {
      case 'w':
        lineWidth = a ?? 1
        break
      case 'J':
        lineCap = a ?? 0
        break
      case 'j':
        lineJoin = a ?? 0
        break
      case 'm':
        currentX = a
        currentY = b
        d += `M${a} ${b} `
        break
      case 'l':
        currentX = a
        currentY = b
        d += `L${a} ${b} `
        break
      case 'c':
        currentX = f
        currentY = g
        d += `C${a} ${b} ${c} ${e} ${f} ${g} `
        break
      case 'v':
        d += `C${currentX} ${currentY} ${a} ${b} ${c} ${e} `
        currentX = c
        currentY = e
        break
      case 'y':
        d += `C${a} ${b} ${c} ${e} ${c} ${e} `
        currentX = c
        currentY = e
        break
      case 're':
        d += `M${a} ${b} h${c} v${e} h${-c} z `
        break
      case 'h':
        d += 'Z '
        break
      case 'S':
        paint(false, true)
        break
      case 's':
        d += 'Z '
        paint(false, true)
        break
      case 'f':
      case 'F':
        paint(true, false)
        break
      case 'f*':
        paint(true, false, true)
        break
      case 'B':
        paint(true, true)
        break
      case 'B*':
        paint(true, true, true)
        break
      case 'b':
        d += 'Z '
        paint(true, true)
        break
      case 'b*':
        d += 'Z '
        paint(true, true, true)
        break
      case 'n':
        d = ''
        break
      // unsupported operators (e.g. dashes, colors, transformations) are ignored
    }
    operands = []
  }

  return output
}

/** Returns the SVG `<pattern>` element for a pdfmake pattern fill */
export function getPatternElement(
  id: string,
  fill: PatternFill,
  patterns: Record<string, Pattern> | undefined,
  opacity?: number | null
): string | undefined {
  const [name, color] = fill
  const pattern = patterns?.[name]
  if (!pattern) return undefined

  // coerce to numbers, as the values are embedded into markup
  const [x1, y1] = pattern.boundingBox.map(Number)
  const xStep = Number(pattern.xStep)
  const yStep = Number(pattern.yStep)
  const hexColor = colorToHex(color)
  const content = patternStreamToSvg(
    String(pattern.pattern ?? ''),
    // only allow valid hex colors, as the value is embedded into markup
    hexColor && /^#[0-9a-f]{3,8}$/i.test(hexColor) ? hexColor : '#000'
  )

  const opacityAttribute =
    opacity != null ? ` opacity="${Number(opacity)}"` : ''

  return (
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${xStep}pt" height="${yStep}pt" viewBox="${x1} ${y1} ${xStep} ${yStep}">` +
    `<g${opacityAttribute}>${content}</g></pattern>`
  )
}

/** Returns a CSS `url()` value of a repeating background image for the pattern */
export function getPatternCssUrl(
  fill: PatternFill,
  patterns: Record<string, Pattern> | undefined,
  opacity?: number | null
): string | undefined {
  const element = getPatternElement('p', fill, patterns, opacity)
  const pattern = patterns?.[fill[0]]
  if (!element || !pattern) return undefined

  const xStep = Number(pattern.xStep)
  const yStep = Number(pattern.yStep)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${xStep}pt" height="${yStep}pt">` +
    `<defs>${element}</defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
