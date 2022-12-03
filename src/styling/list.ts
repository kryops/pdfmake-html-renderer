import type {
  Content,
  ContentOrderedList,
  ContentUnorderedList,
  OrderedListElement,
  UnorderedListElement,
} from 'pdfmake/interfaces'
import type { CssDictionary } from './css-dictionary'
import { getStyleString } from './utils'

export function getUnorderedListStyleString(
  node: ContentUnorderedList
): string | undefined {
  const style: CssDictionary = {
    'list-style-type': node.type ?? 'disc',
  }

  if (node.markerColor) style['--marker-color'] = node.markerColor

  return getStyleString(style)
}

export function getUnorderedListEntryStyleString(
  entry: UnorderedListElement
): string | undefined {
  if (!entry.listType) return undefined

  return getStyleString({
    'list-style-type': entry.listType,
  })
}

const romanChars: { [key: number]: string | undefined } = {
  1: 'I',
  5: 'V',
  10: 'X',
  50: 'L',
  100: 'C',
  500: 'D',
  1000: 'M',
}

function getRomanChars(num: number, start = 1000): string {
  let chars = ''
  let current = num

  while (current >= start) {
    chars += romanChars[start] ?? ''
    current -= start
  }
  if (current < 1) return chars

  if (current >= start * 0.9) {
    chars += romanChars[start / 10] ?? ''
    chars += romanChars[start] ?? ''
    current -= start * 0.9
  }
  if (current < 1) return chars

  if (current >= start / 2) {
    chars += romanChars[start / 2] ?? ''
    current -= start / 2
  }
  if (current >= start * 0.4) {
    chars += romanChars[start / 10] ?? ''
    chars += romanChars[start / 2] ?? ''
    current -= start * 0.4
  }
  if (current < 1 || start < 10) return chars

  return chars + getRomanChars(current, start / 10)
}

function getMaxCharacters(node: ContentOrderedList): number {
  if (!Array.isArray(node.ol)) return 1

  let largestNumber = (node.start ?? 1) + node.ol.length
  const counters = node.ol.filter(it => it.counter).map(it => it.counter!)
  if (counters.length) {
    largestNumber = Math.max(largestNumber, ...counters)
  }

  switch (node.type) {
    case 'upper-alpha':
    case 'lower-alpha':
      return Math.ceil(Math.log(largestNumber) / Math.log(26))
    case 'upper-roman':
    case 'lower-roman':
      return getRomanChars(largestNumber).length
    case 'none':
      return 1
    case 'decimal':
    default:
      return Math.ceil(Math.log10(largestNumber))
  }
}

export function getOrderedListStyleString(node: ContentOrderedList): string {
  // pdfmake applies padding according to the largest number;
  // HTML uses a fixed padding by default
  let characters = getMaxCharacters(node)
  const separator1 =
    node.separator && Array.isArray(node.separator) ? node.separator[0] : ''
  let separator2 = '.'
  if (node.separator) {
    separator2 = Array.isArray(node.separator)
      ? node.separator[1] ?? ''
      : node.separator
  }

  characters += separator1.length + separator2.length

  const style: CssDictionary = {
    'padding-left': 0.25 + characters * 0.6 + 'em',
    '--separator1': JSON.stringify(separator1),
    '--separator2': JSON.stringify(separator2 + ' '),
  }

  const listType = node.type ?? 'decimal'
  style['list-style-type'] = listType
  style['--list-type'] = listType

  if (listType === 'none') {
    style['--separator1'] = "''"
    style['--separator2'] = "''"
  }

  if (node.markerColor) style['--marker-color'] = node.markerColor

  const startPosition = node.reversed
    ? (node.start ?? node.ol.length) + 1
    : (node.start ?? 1) - 1
  if (startPosition !== 0) style['counter-reset'] = `item ${startPosition}`

  // TODO pdfmake left-aligns the list markers

  return getStyleString(style)
}

export function getOrderedListEntryStyleString(
  entry: OrderedListElement
): string | undefined {
  if (entry.counter === undefined && !entry.listType) return undefined

  const style: CssDictionary = {}

  if (entry.counter !== undefined) {
    style['counter-set'] = 'custom ' + entry.counter
  }

  if (entry.listType) {
    style['list-style-type'] = entry.listType
    style['--list-type'] = entry.listType

    if (entry.listType === 'none') {
      style['--separator1'] = "''"
      style['--separator2'] = "''"
    }
  }

  return getStyleString(style)
}
