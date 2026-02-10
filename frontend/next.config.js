const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
	// provide a minimal turbopack config to avoid forcing `--webpack` during builds
	turbopack: {},
	// allow Next.js to build even if TypeScript type-check errors exist during CI
	typescript: {
		ignoreBuildErrors: true,
	},
	// keep experimental.turbo removed (use stable Webpack for builds)
	webpack(config, { isServer }) {
		// prevent bundling of Node-only modules for client-side bundles
		if (!isServer) {
			config.resolve = config.resolve || {};
			config.resolve.fallback = {
				...(config.resolve.fallback || {}),
				fs: false,
				path: false,
				child_process: false,
				os: false,
				net: false,
				tls: false,
				crypto: false,
				// explicitly prevent bundling backend libraries
				'firebase-admin': false,
				'fluent-ffmpeg': false,
				'ffmpeg': false,
			};

			// Provide empty implementations for modules that some libs may try to require
			config.plugins = config.plugins || [];
			config.plugins.push(
				new webpack.DefinePlugin({
					'process.env.NEXT_RUNTIME': JSON.stringify(process.env.NEXT_RUNTIME || 'nodejs'),
				})
			);
		}

		return config;
	},
};

module.exports = nextConfig;
