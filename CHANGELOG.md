# Changelog

## Unreleased

Features

* Added TypeScript typings for server-side rendering. To use it, switch from `pdfmake-html-renderer/dist/server` to `pdfmake-html-renderer/server`

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
