# pdfmake-html-renderer

JavaScript/HTML renderer for [pdfmake](http://pdfmake.org) PDF document definition objects.

Playground: https://kryops.github.io/pdfmake-html-renderer/

## What this library is for

- **Seamlessly embedding** [pdfmake](http://pdfmake.org) document previews into web applications
- **Fast preview** generation and incremental updates, e.g. for editor scenarios or frequent changes
- **Lightweight** alternative to the full [pdfmake](http://pdfmake.org) when rendering document previews on the client (50-110KB minified compared to 2MB)

## Limitations

- **Paging** is not implemented: The document is rendered as a single page
  - Header and footer are rendered at the very top and the very bottom
  - Watermark and background are rendered only once at the top
  - Elements positioned through `absolutePosition` are positioned in reference to the top
  - Page references are rendered as `X`
  - `linkToPage` properties are ignored
  - The table of contents does not render page numbers
  - Manual page breaks specified through `pageBreak` are rendered as a horizontal line
  - `pageBreakBefore` is not implemented
  - For short content, we enforce the height of a single page (unless `mode: 'fluid'` is set)
- **Tiling patterns** are not supported
- **Column widths** behave slightly differently, especially when combining `*` and `auto` widths
- **Relative positioning** ignores the `alignment` property
- **List markers** in ordered lists are right-aligned, while `pdfmake` aligns them to the left
- **QR Codes** look slightly different to the ones created by `pdfmake`, and may be larger for some values of `fit`
- **Attachments** are not displayed

### Supported browsers

Currently, only evergreen browsers are supported explicitly (see `.browserslistrc`).

If you need to support older browsers with your application, you should be able to run this library through [Babel](https://babeljs.io/) as part of your build process and polyfill newer APIs through [core-js](https://github.com/zloirock/core-js).

On old browsers that do not support CSS variables, some styles may be broken.

## Usage

1. Install this package:

```
npm install pdfmake-html-renderer
```

2. Add the CSS file:

```js
import 'pdfmake-html-renderer/dist/index.css'
```

> **NOTE**: For this to work, make sure your tooling/bundler supports importing CSS files. Otherwise, you can always use a `<link rel="stylesheet">` in your HTML file.

3. _(Optional)_ Import fonts:

Any fonts used in your PDF document definitions, including the default [Roboto](https://fonts.google.com/specimen/Roboto) font, should be imported using CSS [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) rules.

To use the version provided by [Google Fonts](https://fonts.google.com/), add the following HTML to your `<head>`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
  rel="stylesheet"
/>
```

Otherwise, the renderer may use a fallback font depending on the fonts installed on the machine.

4. If you have a Content Security Policy, you might need to extend it:

- `style-src 'unsafe-inline'` as computed styles are set inline
- `image-src data:` for images passed as data URL

5. Integrate the component:

```js
import PdfmakeHtmlRenderer from 'pdfmake-html-renderer'
```

This library was built using the [Svelte](https://svelte.dev/) framework, which should allow integrating it into pretty much any web application:

- To consume it from a [Svelte](https://svelte.dev/) application, you may have to add build tooling to support TypeScript into your pipeline, as Svelte needs to compile the components from source
- For a [React](https://reactjs.org/) or [Vue.js](https://vuejs.org/) application, you can use an adapter like [`svelte-adapter`](https://github.com/pngwn/svelte-adapter)
- For other frameworks or VanillaJS, have a look at the [Svelte Component API](https://svelte.dev/docs/client-side-component-api)

Check out the `/examples` folder for some example projects.

> **TIP**: If you don't need QR Code support, you can try and ignore the `qrcode` package in your build process / bundler. This will roughly cut this package's bundle size in half.

### TypeScript support

This package provides TypeScript typings. They depend on the typings for `svelte` and `pdfmake`, which are not included as dependencies and need to be added manually:

```
npm install -D svelte @types/pdfmake
```

### Node.js server-side rendering **[EXPERIMENTAL]**

This library also provides an **experimental** server build that renders static HTML and CSS:

```js
const { PdfmakeHtmlRenderer } = require('pdfmake-html-renderer/server')

const { html, css } = PdfmakeHtmlRenderer.render({
  document: { content: ['Hello, world!'] },
})

// html contains the HTML code
// css.code contains the CSS code
```

Check out `/examples/nodejs` for an exmaple.

Rendering on the server comes with some additional limitations:

- QR codes are not supported
- Zooming / shrinking the page does not work
- Relative positioning may not always be placed correctly

## Options / Props

### `document: TDocumentDefinitions`

The pdfmake document definition

### `pageShadow?: boolean`

Whether or not to display a shadow around the page.

Defaults to `true`

### `mode?: 'shrinkToFit' | 'zoomToFit' | 'natural' | 'fluid'`

Rendering / sizing mode

- `shrinkToFit` _(default)_: Shrinks the document to fit in its container,
  but does not grow beyond the document's natural size
- `zoomToFit`: Shrinks or grows the document to fit in its container
- `natural`: Renders the document in its exact natural size
- `fluid`: Ignores the document's `pageSize` and uses the space available in the container

When the `document` definition does not specify a `pageSize` property,
the standard size `'A4'` is assumed.
