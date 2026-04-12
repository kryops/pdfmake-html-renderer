import type { TDocumentDefinitions } from 'pdfmake/interfaces'

export function evaluateDocument(content: string): TDocumentDefinitions {
  if (content.trim().startsWith('{')) {
    return new Function(`return (${content});`)()
  } else {
    return new Function(`${content}\nreturn dd;`)()
  }
}
