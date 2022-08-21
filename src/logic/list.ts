import type {
  Content,
  OrderedListElement,
  UnorderedListElement,
} from 'pdfmake/interfaces'

function isListNode(node: Content) {
  return (
    typeof node === 'object' &&
    !Array.isArray(node) &&
    node &&
    ('ul' in node || 'ol' in node)
  )
}

export function getListItemsToRender<
  T extends OrderedListElement | UnorderedListElement
>(list: T[]): Array<[T, Content | null, number]> {
  if (!Array.isArray(list)) return []

  return list
    .map<null | [T, Content | null, number]>((entry, index) => {
      const next = isListNode(list[index + 1]) ? list[index + 1] : null
      return index === 0 || !isListNode(entry) ? [entry, next, index] : null
    })
    .filter(Boolean) as Array<[T, Content | null, number]>
}
