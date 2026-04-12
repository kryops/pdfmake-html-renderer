import { PdfmakeHtmlRenderer } from '../index'

export * from '../index'
export default PdfmakeHtmlRenderer

// Required because of https://github.com/sveltejs/svelte/issues/17027
export { render } from 'svelte/server'
