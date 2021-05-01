import type { ContentQr } from 'pdfmake/interfaces'
import { colorToHex } from '../styling/utils'

export async function buildQrCode(node: ContentQr): Promise<string | null> {
  const QRCode = (await import('qrcode')).default
  return new Promise(resolve => {
    QRCode.toString(
      node.mode
        ? [{ data: node.qr, mode: node.mode === 'octet' ? 'byte' : node.mode }]
        : node.qr,
      {
        version: node.version,
        color: {
          dark: colorToHex(node.foreground),
          light: colorToHex(node.background),
        },
        errorCorrectionLevel: node.eccLevel,
        maskPattern: node.mask,
        margin: 0,
      } as any,
      (err, result) => {
        resolve(err ? null : 'data:image/svg+xml,' + encodeURIComponent(result))
      }
    )
  })
}
