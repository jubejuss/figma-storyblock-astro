import { defineConfig } from 'astro/config';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';

const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
const {
	NETLIFY,
	STORYBLOK_DELIVERY_API_TOKEN,
	STORYBLOK_API_BASE_URL,
	STORYBLOK_REGION,
} = env;

export default defineConfig({
	devToolbar: { enabled: false },
	integrations: [
		storyblok({
			accessToken: STORYBLOK_DELIVERY_API_TOKEN,
			bridge: true,
			enableFallbackComponent: true,
			customFallbackComponent: 'storyblok/Fallback',
			apiOptions: {
				region: STORYBLOK_REGION || 'eu',
				endpoint: STORYBLOK_API_BASE_URL
					? `${new URL(STORYBLOK_API_BASE_URL).origin}/v2`
					: undefined,
			},
			components: {
				page: 'storyblok/Page',
				article: 'storyblok/Article',
				config: 'storyblok/Config',
				header: 'storyblok/Header',
				footer: 'storyblok/Footer',
				article_card: 'storyblok/ArticleCard',
				article_list: 'storyblok/ArticleList',
				article_header: 'storyblok/ArticleHeader',
				rich_text: 'storyblok/RichText',
			},
		}),
	],
	output: 'server',
	adapter: NETLIFY ? netlify() : vercel(),
	vite: { plugins: [mkcert()] },
});
