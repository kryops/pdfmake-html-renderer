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
