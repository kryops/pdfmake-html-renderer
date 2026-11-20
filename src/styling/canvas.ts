import type {
  CanvasEllipse,
  CanvasFilledElement,
  CanvasLine,
  CanvasLineElement,
  CanvasPolyline,
  CanvasRect,
  ContentCanvas,
  Dash,
} from 'pdfmake/interfaces'
import { opacityColor } from './utils'

type Properties = Record<string, string>

export function getCanvasProperties(node: ContentCanvas): Properties {
  let width = 1
  let height = 1

  if (Array.isArray(node.canvas)) {
    node.canvas.forEach(element => {
      if ('w' in element) {
        const w = element.x + element.w
        if (w > width) width = w

        const h = element.y + element.h
        if (h > height) height = h
      } else if ('r1' in element) {
        const w = element.x + element.r1
        if (w > width) width = w

        const h = element.y + (element.r2 ?? element.r1)
        if (h > height) height = h
      } else if ('x1' in element) {
        const w = Math.max(element.x1, element.x2)
        if (w > width) width = w

        const h = Math.max(element.y1, element.y2)
        if (h > height) height = h
      } else if ('points' in element && Array.isArray(element.points)) {
        element.points.forEach(point => {
          if (!point) return
          if (point.x > width) width = point.x
          if (point.y > height) height = point.y
        })
      }
    })
  }

  return {
    width: width + 'pt',
    height: height + 'pt',
  }
}

/** pdfmake supports `path` elements, but they are not part of the types */
export interface CanvasPath extends CanvasLineElement, CanvasFilledElement {
  type: 'path'
  d: string
}

function getCanvasFilledElementProperties(
  element: CanvasFilledElement,
  gradientId: string
): Properties {
  const properties: Properties = {
    fill: 'none',
  }

  if (element.linearGradient) {
    properties.fill = `url('#${gradientId}')`
  } else if (Array.isArray(element.color)) {
    // tiling pattern, see ContentCanvasRenderer
    properties.fill = `url('#${gradientId}')`
  } else if (element.color) {
    const color = opacityColor(element.color, element.fillOpacity)
    if (color) properties.fill = color
  }

  return properties
}

function getCanvasLineElementProperties(
  element: CanvasLineElement & { lineCap?: CanvasLine['lineCap'] },
  /** `path` elements are scaled to points, so they use unitless values */
  unit = 'pt'
): Properties {
  if (
    !element.lineColor &&
    ('color' in element || 'linearGradient' in element)
  ) {
    return {}
  }

  const properties: Properties = {
    stroke: element.lineColor ?? '#000',
    // pdfmake treats a lineWidth of 0 as 1
    'stroke-width': (element.lineWidth || 1) + unit,
  }

  if (element.strokeOpacity != null) {
    properties['stroke-opacity'] = String(element.strokeOpacity)
  }

  if (element.lineJoin) {
    properties['stroke-linejoin'] = element.lineJoin
  }

  // pdfmake applies the line cap to all elements, e.g. dashed rectangles
  if (element.lineCap) {
    properties['stroke-linecap'] = element.lineCap
  }

  if (element.dash && typeof element.dash === 'object') {
    const { space, length, phase } = element.dash as Dash & { phase?: number }
    properties['stroke-dasharray'] =
      `${length}${unit},${space || length}${unit}`
    if (phase) properties['stroke-dashoffset'] = phase + unit
  }

  return properties
}

export function getCanvasRectProperties(
  rect: CanvasRect,
  gradientId: string
): Properties {
  const properties: Properties = {
    ...getCanvasFilledElementProperties(rect, gradientId),
    ...getCanvasLineElementProperties(rect),
    x: rect.x + 'pt',
    y: rect.y + 'pt',
    width: Math.max(rect.w, rect.h ? 1 : 0) + 'pt',
    height: Math.max(rect.h, rect.w ? 1 : 0) + 'pt',
  }

  if (rect.r) {
    properties.rx = rect.r + 'pt'
    properties.ry = rect.r + 'pt'
  }

  return properties
}

export function getCanvasEllipseProperties(
  ellipse: CanvasEllipse,
  gradientId: string
): Properties {
  const properties: Properties = {
    ...getCanvasFilledElementProperties(ellipse, gradientId),
    ...getCanvasLineElementProperties(ellipse),
    cx: ellipse.x + 'pt',
    cy: ellipse.y + 'pt',
    rx: ellipse.r1 + 'pt',
    ry: (ellipse.r2 ?? ellipse.r1) + 'pt',
  }

  return properties
}

export function getCanvasLineProperties(line: CanvasLine): Properties {
  const properties: Properties = {
    ...getCanvasLineElementProperties(line),
    x1: line.x1 + 'pt',
    x2: line.x2 + 'pt',
    y1: line.y1 + 'pt',
    y2: line.y2 + 'pt',
  }

  return properties
}

export function getCanvasPolylineProperties(
  line: CanvasPolyline,
  gradientId: string
): Properties {
  if (!Array.isArray(line.points)) return {}

  // pdfmake only applies gradients to rectangles and ellipses
  const { linearGradient: _, ...element } = line

  const properties: Properties = {
    ...getCanvasFilledElementProperties(element, gradientId),
    ...getCanvasLineElementProperties(element),
    points: line.points
      .filter(point => typeof point === 'object' && !!point)
      .map(({ x, y }) => `${(x * 4) / 3},${(y * 4) / 3}`)
      .join(' '),
  }

  return properties
}

/**
 * pdfmake closes polylines when `closePath` is set, or when the first and
 * last point are the same. We render them as `<polygon>` then.
 */
export function isClosedPolyline(line: CanvasPolyline): boolean {
  if (!Array.isArray(line.points) || line.points.length < 2) return false
  if (line.closePath) return true
  const first = line.points[0]
  const last = line.points[line.points.length - 1]
  return !!first && !!last && first.x === last.x && first.y === last.y
}

/** Path elements are rendered within a group that scales them to points */
export function getCanvasPathProperties(
  path: CanvasPath,
  gradientId: string
): Properties {
  // pdfmake only applies gradients to rectangles and ellipses
  const { linearGradient: _, ...element } = path

  return {
    ...getCanvasFilledElementProperties(element, gradientId),
    ...getCanvasLineElementProperties(element, ''),
    d: typeof path.d === 'string' ? path.d : '',
  }
}
