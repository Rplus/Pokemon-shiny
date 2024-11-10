import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import dsv from '@rollup/plugin-dsv';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		dsv(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@lib': path.resolve(__dirname, 'src/lib'),
			'@comp': path.resolve(__dirname, 'src/component'),
			'@data': path.resolve(__dirname, 'src/assets/data'),
		},
	},
});
