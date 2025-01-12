import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		environment: 'jsdom'
	},
	plugins: [sveltekit()],
	server: {
		port:3000
	},
	resolve:{
		alias:{
			'@tailwind':path.resolve('./src/app.css')
		}
	}
});
