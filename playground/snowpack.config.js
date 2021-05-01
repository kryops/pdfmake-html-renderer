const path = require('path');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  root: __dirname,
  workspaceRoot: path.join(__dirname, '..'),
  mount: {
    /* ... */
  },
  plugins: ['@snowpack/plugin-svelte', '@snowpack/plugin-typescript'],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: true,
  },
  packageOptions: {
    polyfillNode: false,
    knownEntrypoints: ['svelte', 'svelte/store', 'qrcode', 'css-color-names'],
  },
  devOptions: {
    port: 8079,
  },
  buildOptions: {
    baseUrl: './',
    sourcemap: true,
  },
}
