import {
  generate,
  correction,
  mode,
  type Correction,
  type Mask,
  type Mode,
} from 'lean-qr'
import { toSvgSource } from 'lean-qr/extras/svg'

import type { ContentQr } from 'pdfmake/interfaces'
import { colorToHex } from '../styling/utils'

function toCorrection(
  correctionLevel: ContentQr['eccLevel']
): Correction | undefined {
  switch (correctionLevel) {
    case 'L':
      return correction.L
    case 'M':
      return correction.M
    case 'Q':
      return correction.Q
    case 'H':
      return correction.H
    default:
      return undefined
  }
}

function toMask(mask: ContentQr['mask']): Mask | undefined {
  if (mask === undefined) return undefined
  if (mask < 0 || mask > 7) return undefined
  return mask as Mask
}

function toModeOrString(node: ContentQr): string | Mode {
  switch (node.mode) {
    case 'numeric':
      return mode.numeric(node.qr)
    case 'alphanumeric':
      return mode.alphaNumeric(node.qr)
    case 'octet':
      return mode.bytes(new TextEncoder().encode(node.qr))
    default:
      return node.qr
  }
}

export function buildQrCode(node: ContentQr): string {
  const code = generate(toModeOrString(node), {
    minVersion: node.version,
    maxVersion: node.version,
    minCorrectionLevel: toCorrection(node.eccLevel),
    maxCorrectionLevel: toCorrection(node.eccLevel),
    mask: toMask(node.mask),
  })

  const svgSource = toSvgSource(code, {
    on: colorToHex(node.foreground),
    off: colorToHex(node.background),
    pad: 0,
    width: null,
    height: null,
    xmlDeclaration: false,
    scale: 1,
  })

  return 'data:image/svg+xml,' + encodeURIComponent(svgSource)
}
