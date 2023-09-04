// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		// "@sidebase/nuxt-auth",
		"@nuxt/devtools",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
	],
	css: ["@/assets/css/main.css"],
	colorMode: {
		preference: "dark",
		classSuffix: "",
	},
	experimental: {
		typedPages: true,
	},
	runtimeConfig: {
		// Public keys that are exposed to the client
		public: {
			party: process.env.NUXT_PUBLIC_PARTY || "localhost:1999",
		},
	},
	build: {
		transpile: ["trpc-nuxt"],
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	typescript: {
		shim: false,
	},
	devtools: {
		// Enable devtools (default: true)
		enabled: true,
		// VS Code Server options
		vscode: {},
		// ...other options
	},
});
