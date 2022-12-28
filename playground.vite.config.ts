import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { svelte } = await import('@sveltejs/vite-plugin-svelte')
  return {
    plugins: [svelte()],
    build: {
      outDir: '../docs',
      emptyOutDir: true,
      sourcemap: true,
    },
    root: 'playground',
    base: './',
  }
})
