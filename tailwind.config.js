import colors from "tailwindcss/colors";
import forms from "@tailwindcss/forms";
// import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./nuxt.config.{js,ts}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				gray: colors.stone,
			},
		},
	},
	plugins: [forms()],
};
