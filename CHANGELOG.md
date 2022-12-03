# Changelog

## Unreleased

Features

* Added support inline style objects in style reference arrays
* Added support for complex image definition objects
* Added support for single-side margins (e.g. `marginLeft`)
* Added support for `preserveTrailingSpaces`
* Added support for new `pageBreak` values `...Odd` / `...Even`
* Added support for multiple ToCs
* Added support for `lineJoin` and `strokeOpacity` on canvas elements
* Made renderer more resilient to avoid crashes for invalid content

Bug Fixes

* Fixed rendering differences between strings/array and text/stack nodes
* Fixed negative margins
* Fixed positive margin affecting the background
* Fixed background for lists, columns, and in `defaultStyle`
* Fixed behaviour around spaces and `preserveLeadingSpaces`
* Fixed inheritance for `leadingIndent`, `fillColor`/`fillOpacity`, `columnGap`, and `noWrap`
* Fixed applying anchor styles in text references
* Fixed `noWrap` in table cell with fixed width
* Fixed edge cases around table borders
* Fixed `pageOrientation` if the page width is larger than its height
* Fixed printing `undefined` as watermark text
* Fixed custom ordered list item counter with non-decimal list type
* Fixed rendering a stroke for a filled canvas polyline
* Fixed computing the height of a canvas ellipse without `r2` set

Internal

* Switched build tooling to Vite

## v0.1.2 - 2022-05-22

Features

* Handle tiling pattern syntax (tiling patterns are ignored)

Bug Fixes

* Fixed default watermark color and opacity
* Fixed `counter: 0` for ordered list items not being applied
* Fixed `type: 'none'` for ordered lists wrongly rendering a separator
* Fixed resetting the type when nesting lists
* Fixed collapsing margins
* Fixed ToC width

## v0.1.1 - 2021-05-26

Features

* Added TypeScript typings for server-side rendering. To use them, switch from `pdfmake-html-renderer/dist/server` to `pdfmake-html-renderer/server`

Bug Fixes

* Fixed link node styles being applied twice, leading to an additional space after the link
* Fixed `noWrap` not being applied correctly
* Fixed `fillOpacity: 0` not being applied correctly
* Fixed rendering of primitive numbers as content
* Fixed page background being rendered in front of the content
* Fixed spaces between text array elements
* Fixed some cases for empty elements and elements containing only spaces
* Fixed using unscoped CSS class names

Internal

* Added visual regression tests

## v0.1.0 - 2021-05-08

Initial Release
