import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async ({ ssrBuild, mode }) => {
  const { svelte } = await import('@sveltejs/vite-plugin-svelte')
  const env = loadEnv(mode, process.cwd(), '')
  const isGlobal = !!env.BUILD_GLOBAL

  return {
    plugins: [
      svelte({
        compilerOptions: {
          cssHash: ({ hash, css }) => `phr-${hash(css)}`,
        },
      }),
    ],
    build: {
      target: 'es2015',
      outDir: ssrBuild ? 'dist/server' : 'dist',
      emptyOutDir: !isGlobal,
      lib: {
        entry: 'src/index.ts',
        name: 'pdfmakeHtmlRenderer',
        formats: ssrBuild ? ['cjs'] : isGlobal ? ['iife'] : ['es', 'cjs'],
        fileName(format) {
          if (format === 'iife') return 'global.js'
          if (format === 'umd') return 'umd.js'
          if (format === 'cjs') return 'index.js'
          return 'index.mjs'
        },
      },
      rollupOptions: {
        external: isGlobal ? [] : ['qrcode'],
      },
    },
  }
})
