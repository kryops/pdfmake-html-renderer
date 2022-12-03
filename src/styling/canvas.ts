import type {
  CanvasEllipse,
  CanvasFilledElement,
  CanvasLine,
  CanvasLineElement,
  CanvasPolyline,
  CanvasRect,
  ContentCanvas,
} from 'pdfmake/interfaces'
import { opacityColor } from './utils'

type Properties = Record<string, string>

export function getCanvasProperties(node: ContentCanvas): Properties {
  let width = 0
  let height = 0

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

function getCanvasFilledElementProperties(
  element: CanvasFilledElement,
  index: number
): Properties {
  const properties: Properties = {
    fill: 'none',
  }

  if (element.linearGradient) {
    properties.fill = `url('#gradient${index}')`
  } else if (element.color) {
    const color = opacityColor(element.color, element.fillOpacity)
    if (color) properties.fill = color
  }

  return properties
}

function getCanvasLineElementProperties(
  element: CanvasLineElement
): Properties {
  if (
    !element.lineColor &&
    ('color' in element || 'linearGradient' in element)
  ) {
    return {}
  }

  const properties: Properties = {
    stroke: element.lineColor ?? '#000',
    'stroke-width': (element.lineWidth ?? 1) + 'pt',
  }

  if (element.strokeOpacity !== undefined) {
    properties['stroke-opacity'] = String(element.strokeOpacity)
  }

  if (element.lineJoin) {
    properties['stroke-linejoin'] = element.lineJoin
  }

  if (element.dash && typeof element.dash === 'object') {
    const { space, length } = element.dash
    properties['stroke-dasharray'] = `${length}pt,${space ?? length}pt`
  }

  return properties
}

export function getCanvasRectProperties(
  rect: CanvasRect,
  index: number
): Properties {
  const properties: Properties = {
    ...getCanvasFilledElementProperties(rect, index),
    ...getCanvasLineElementProperties(rect),
    x: rect.x + 'pt',
    y: rect.y + 'pt',
    width: rect.w + 'pt',
    height: rect.h + 'pt',
  }

  if (rect.r) {
    properties.rx = rect.r + 'pt'
    properties.ry = rect.r + 'pt'
  }

  return properties
}

export function getCanvasEllipseProperties(
  ellipse: CanvasEllipse,
  index: number
): Properties {
  const properties: Properties = {
    ...getCanvasFilledElementProperties(ellipse, index),
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

  if (line.lineCap) {
    properties['stroke-linecap'] = line.lineCap
  }

  return properties
}

export function getCanvasPolylineProperties(
  line: CanvasPolyline,
  index: number
): Properties {
  if (!Array.isArray(line.points)) return {}

  const points = line.closePath ? [...line.points, line.points[0]] : line.points

  const properties: Properties = {
    ...getCanvasFilledElementProperties(line, index),
    ...getCanvasLineElementProperties(line),
    points: points
      .filter(point => typeof point === 'object' && !!point)
      .map(({ x, y }) => `${(x * 4) / 3},${(y * 4) / 3}`)
      .join(' '),
  }

  if (line.lineCap) {
    properties['stroke-linecap'] = line.lineCap
  }

  return properties
}
