import colornames from 'colornames'
import type { CssDictionary } from './css-dictionary'

export function getStyleString(styles: CssDictionary) {
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}

export function colorToHex(color: string | undefined): string | undefined {
  if (color === 'transparent') return undefined
  if (!color || color.startsWith('#')) return color
  return colornames(color) ?? undefined
}

export function colorToRgb(
  color: string | undefined
): [number, number, number] | undefined {
  if (!color || color === 'transparent') return undefined
  const hexColor = colorToHex(color)
  if (!hexColor) return undefined
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5), 16),
  ]
}

export function opacityColor(
  color: string | null | undefined,
  opacity: number | null | undefined
): string | undefined {
  if (color == null) return undefined
  if (opacity == null || opacity == 1) return color
  if (opacity == 0) return 'transparent'
  const rgb = colorToRgb(color)
  if (!rgb) return color;

  return `rgba(${rgb.join(', ')}, ${opacity})`
}
