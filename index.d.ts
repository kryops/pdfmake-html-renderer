/// <reference types="svelte" />
/// <reference types="pdfmake" />
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { SvelteComponentTyped } from 'svelte'

export interface PdfmakeHtmlRendererProps {
  /**
   * The pdfmake document definition
   */
  document: TDocumentDefinitions

  /**
   * Whether or not to display a shadow around the page.
   *
   * Defaults to `true`
   */
  pageShadow?: boolean

  /**
   * Rendering / sizing mode
   *
   * - `shrinkToFit` _(default)_: Shrinks the document to fit in its container,
   *   but does not grow larger than the document's natural size
   * - `zoomToFit`: Shrinks or grows the document to fit in its container
   * - `natural`: Renders the document in its exact natural size
   * - `fluid`: Ignores the document's `pageSize` and uses the space available in the container
   *
   * When the `document` definition does not specify a `pageSize` property,
   * the standard size `'A4'` is assumed.
   */
  mode?: 'shrinkToFit' | 'zoomToFit' | 'natural' | 'fluid'
}

/**
 * pdfmake HTML renderer component.
 *
 * See https://svelte.dev/docs#Client-side_component_API
 * about how to use Svelte components.
 */
export class PdfmakeHtmlRenderer extends SvelteComponentTyped<
  PdfmakeHtmlRendererProps,
  {},
  {}
> {}

export default PdfmakeHtmlRenderer
