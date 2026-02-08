import absolute from './absolute'
import background from './background'
import basics from './basics'
import columns_simple from './columns_simple'
import headerFooter from './header-footer'
import images from './images'
import links from './links'
import lists from './lists'
import margins from './margins'
import pageReference from './pageReference'
import qrCode from './qrCode'
import relative from './relative'
import sections from './sections'
import styling_inlines from './styling_inlines'
import styling_named_styles from './styling_named_styles'
import styling_named_styles_with_extends from './styling_named_styles_with_extends'
import styling_named_styles_with_overrides from './styling_named_styles_with_overrides'
import styling_properties from './styling_properties'
import svgs from './svgs'
import tables from './tables'
import textDecorations from './textDecorations'
import toc from './toc'
import vectors from './vectors'
import watermark from './watermark'

export interface Example {
  name: string
  code: string
}

export const examples: Example[] = [
  {
    name: 'Basics',
    code: basics,
  },
  {
    name: 'Absolute',
    code: absolute,
  },
  {
    name: 'Background',
    code: background,
  },
  {
    name: 'Columns',
    code: columns_simple,
  },
  {
    name: 'Images',
    code: images,
  },
  {
    name: 'Links',
    code: links,
  },
  {
    name: 'Lists',
    code: lists,
  },
  {
    name: 'Margins',
    code: margins,
  },
  {
    name: 'Page References',
    code: pageReference,
  },
  {
    name: 'QR Code',
    code: qrCode,
  },
  {
    name: 'Relative',
    code: relative,
  },
  {
    name: 'Sections',
    code: sections,
  },
  {
    name: 'Styling (Inlines)',
    code: styling_inlines,
  },
  {
    name: 'Styling (Extends)',
    code: styling_named_styles_with_extends,
  },
  {
    name: 'Styling (Overrides)',
    code: styling_named_styles_with_overrides,
  },
  {
    name: 'Styling (Named)',
    code: styling_named_styles,
  },
  {
    name: 'Styling (Properties)',
    code: styling_properties,
  },
  {
    name: 'SVGs',
    code: svgs,
  },
  {
    name: 'Tables',
    code: tables,
  },
  {
    name: 'Decorations',
    code: textDecorations,
  },
  {
    name: 'ToC',
    code: toc,
  },
  {
    name: 'Vectors',
    code: vectors,
  },
  {
    name: 'Watermark',
    code: watermark,
  },
  {
    name: 'Header/Footer',
    code: headerFooter,
  },
]
