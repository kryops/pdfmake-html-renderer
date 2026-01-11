# Changelog

## Unreleased

- Added support for `wordBreak: 'break-all'` (#9)

## v0.3.1 - 2024-08-25

- Fixed canvas element not displayed if its height or width is based on the line width only (#5)

## v0.3.0 - 2024-02-04

- **[MAYBE BREAKING]** Switched to `@sveltejs/package` and conditional package exports
- Added support for `decoration` arrays
- Added support for QR code `padding`

## v0.2.0 - 2023-10-04

- **[MAYBE BREAKING]** Updated to Svelte 4

## v0.1.4 - 2022-12-03

- Fixed publishing of the Node.js bundle
- Fixed usage within Svelte projects by including the sources into the published package

## v0.1.3 - 2022-12-03

Features

- Added support inline style objects in style reference arrays
- Added support for complex image definition objects
- Added support for single-side margins (e.g. `marginLeft`)
- Added support for `preserveTrailingSpaces`
- Added support for new `pageBreak` values `...Odd` / `...Even`
- Added support for multiple ToCs
- Added support for `lineJoin` and `strokeOpacity` on canvas elements
- Made renderer more resilient to avoid crashes for invalid content

Bug Fixes

- Fixed rendering differences between strings/array and text/stack nodes
- Fixed negative margins
- Fixed positive margin affecting the background
- Fixed background for lists, columns, and in `defaultStyle`
- Fixed behaviour around spaces and `preserveLeadingSpaces`
- Fixed inheritance for `leadingIndent`, `fillColor`/`fillOpacity`, `columnGap`, and `noWrap`
- Fixed applying anchor styles in text references
- Fixed `noWrap` in table cell with fixed width
- Fixed edge cases around table borders
- Fixed `pageOrientation` if the page width is larger than its height
- Fixed printing `undefined` as watermark text
- Fixed custom ordered list item counter with non-decimal list type
- Fixed rendering a stroke for a filled canvas polyline
- Fixed computing the height of a canvas ellipse without `r2` set

Internal

- Switched build tooling to Vite

## v0.1.2 - 2022-05-22

Features

- Handle tiling pattern syntax (tiling patterns are ignored)

Bug Fixes

- Fixed default watermark color and opacity
- Fixed `counter: 0` for ordered list items not being applied
- Fixed `type: 'none'` for ordered lists wrongly rendering a separator
- Fixed resetting the type when nesting lists
- Fixed collapsing margins
- Fixed ToC width

## v0.1.1 - 2021-05-26

Features

- Added TypeScript typings for server-side rendering. To use them, switch from `pdfmake-html-renderer/dist/server` to `pdfmake-html-renderer/server`

Bug Fixes

- Fixed link node styles being applied twice, leading to an additional space after the link
- Fixed `noWrap` not being applied correctly
- Fixed `fillOpacity: 0` not being applied correctly
- Fixed rendering of primitive numbers as content
- Fixed page background being rendered in front of the content
- Fixed spaces between text array elements
- Fixed some cases for empty elements and elements containing only spaces
- Fixed using unscoped CSS class names

Internal

- Added visual regression tests

## v0.1.0 - 2021-05-08

Initial Release
