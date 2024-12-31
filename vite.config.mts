import { defineConfig, loadEnv, type UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async ({ isSsrBuild, mode }) => {
  const { svelte } = await import('@sveltejs/vite-plugin-svelte')
  const env = loadEnv(mode, process.cwd(), '')
  const isGlobal = !!env.BUILD_GLOBAL

  const config: UserConfig = {
    plugins: [
      svelte({
        compilerOptions: {
          cssHash: ({ hash, css }) => `phr-${hash(css)}`,
          css: isSsrBuild ? 'injected' : undefined,
        },
      }),
    ],
    build: {
      target: 'es2015',
      outDir: isSsrBuild ? 'dist/server' : 'dist',
      emptyOutDir: !isGlobal,
      lib: {
        entry: 'src/index.ts',
        name: 'pdfmakeHtmlRenderer',
        formats: isGlobal ? ['iife'] : ['es', 'cjs'],
        fileName(format) {
          if (format === 'iife') return 'global.js'
          if (format === 'umd') return 'umd.js'
          if (format === 'cjs') return 'index.cjs'
          return 'index.mjs'
        },
      },
      rollupOptions: {
        external: isGlobal ? [] : ['qrcode'],
        output: {
          // This suppresses the warning about having both a default and a named export
          exports: 'named',
        },
      },
    },
  }

  return config
})
