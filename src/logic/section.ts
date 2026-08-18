import type { Content } from 'pdfmake'
import type { ContentSection } from 'pdfmake/interfaces'

export function getInheritedPageMargins(
  nodes: Content[],
  currentNode: Content
): Exclude<ContentSection['pageMargins'], 'inherit'> | undefined {
  const currentNodeIndex = nodes.indexOf(currentNode)
  if (currentNodeIndex <= 0) return undefined

  const previousSections = nodes
    .filter(
      (candidate, index) =>
        index < currentNodeIndex &&
        typeof candidate === 'object' &&
        candidate !== null &&
        !Array.isArray(candidate) &&
        'section' in candidate
    )
    .reverse() as ContentSection[]

  for (const section of previousSections) {
    if (section.pageMargins !== 'inherit') {
      return section.pageMargins
    }
  }

  return undefined
}
