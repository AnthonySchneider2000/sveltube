import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$src: '/src',
			$components: '/src/components',
			$root: '/',
			$routes: '/src/routes',
			$utils: '/src/utils',
			$types: '/src/types',
			$stores: '/src/stores',
		},
	},
});
