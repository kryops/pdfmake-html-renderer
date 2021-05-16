import type { PdfmakeHtmlRendererProps } from '.'

// Svelte does not seem to have an official type for this yet.
// This definition was adapted from the auto-generated return type
// of Svelte's create_ssr_component() function
interface SvelteSsrComponent<TProps extends object> {
  render: (
    props?: TProps,
    {
      $$slots,
      context,
    }?: {
      $$slots?: {}
      context?: Map<any, any>
    }
  ) => {
    html: string
    css: {
      code: string
      map: any
    }
    head: string
  }
}

export const PdfmakeHtmlRenderer: SvelteSsrComponent<PdfmakeHtmlRendererProps>
