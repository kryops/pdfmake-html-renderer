import cssColorNames from './css-color-names'
import type { CssDictionary } from './css-dictionary'

export function getStyleString(styles: CssDictionary) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}

export function colorToHex(color: string | undefined): string | undefined {
  if (color === 'transparent') return undefined
  if (!color || color.startsWith('#')) return color
  return cssColorNames[color as keyof typeof cssColorNames] ?? undefined
}

export function colorToRgb(
  color: string | string[] | undefined
): [number, number, number] | undefined {
  // We ignore tiling patterns (arrays)
  if (!color || Array.isArray(color) || color === 'transparent')
    return undefined
  const hexColor = colorToHex(color)
  if (!hexColor) return undefined
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5), 16),
  ]
}

export function opacityColor(
  color: string | string[] | null | undefined,
  opacity: number | null | undefined
): string | undefined {
  // We ignore tiling patterns (arrays)
  if (color == null || Array.isArray(color)) return undefined
  if (opacity == null || opacity == 1) return color
  if (opacity == 0) return 'transparent'
  const rgb = colorToRgb(color)
  if (!rgb) return color

  return `rgba(${rgb.join(', ')}, ${opacity})`
}
