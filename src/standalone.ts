import { PdfmakeHtmlRenderer } from './index'

export * from './index'
export default PdfmakeHtmlRenderer

// Using the imperative API from a separate "svelte" import does not seem to work
// Maybe https://github.com/sveltejs/svelte/issues/17027
export { mount, unmount } from 'svelte'
