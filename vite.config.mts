import { defineConfig, loadEnv, type UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async ({ isSsrBuild, mode }) => {
  const { svelte } = await import('@sveltejs/vite-plugin-svelte')
  const env = loadEnv(mode, process.cwd(), '')
  const isStandalone = !!env.BUILD_STANDALONE

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
      emptyOutDir: !isStandalone,
      lib: {
        entry: isSsrBuild
          ? 'src/server/index.ts'
          : isStandalone
            ? 'src/standalone.ts'
            : 'src/index.ts',
        name: 'pdfmakeHtmlRenderer',
        formats: isStandalone ? ['es'] : ['es', 'cjs'],
        fileName(format) {
          if (isStandalone) return 'standalone.mjs'
          if (format === 'umd') return 'umd.js'
          if (format === 'cjs') return 'index.cjs'
          return 'index.mjs'
        },
      },
      rolldownOptions: {
        external: isStandalone ? [] : ['qrcode', /^svelte($|\/)/],
        output: {
          // This suppresses the warning about having both a default and a named export
          exports: 'named',
        },
      },
    },
  }

  return config
})
