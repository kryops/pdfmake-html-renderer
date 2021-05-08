import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import preprocess from 'svelte-preprocess';

function config(format, name, ssr = false) {
	return {
		input: 'src/index.ts',
		output: {
			sourcemap: true,
			format,
			file: `dist/${name}.js`,
			name: 'pdfmakeHtmlRenderer',
		},
		external: format === 'iife' ? [] : ['qrcode'],
		plugins: [
			svelte({
				include: '**/*.svelte',
				compilerOptions: {
					dev: false,
					generate: ssr ? 'ssr' : undefined,
				},
				preprocess: preprocess({
					typescript: true
				})
			}),
			css({ output: 'index.css' }),
			resolve({
				browser: !ssr,
				dedupe: ['svelte'],
				extensions: ['.ts', '.mjs', '.js', '.json', '.node' ],
				preferBuiltins: ssr
			}),
			commonjs(),
			babel({
				babelHelpers: 'bundled',
				extensions: ['.ts', '.svelte']
			}),
			terser()
		],
	}
}

export default [
	config('esm', 'index.esm'),
	config('cjs', 'index'),
	config('cjs', 'server', true),
	config('iife', 'global')
];