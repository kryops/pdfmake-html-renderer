import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import preprocess from 'svelte-preprocess';

function config(format, name) {
	return {
		input: 'src/index.ts',
		output: {
			sourcemap: true,
			format,
			file: `dist/${name}.js`
		},
		plugins: [
			svelte({
				include: '**/*.svelte',
				compilerOptions: {
					dev: false
				},
				preprocess: preprocess({
					typescript: true
				})
			}),
			css({ output: 'index.css' }),
			resolve({
				browser: true,
				dedupe: ['svelte'],
				extensions: ['.ts', '.mjs', '.js', '.json', '.node' ]
			}),
			commonjs(),
			babel({
				babelHelpers: 'bundled',
				extensions: ['.ts']
			}),
			terser()
		],
	}
}

export default [
	config('esm', 'index.esm'),
	config('cjs', 'index')
];