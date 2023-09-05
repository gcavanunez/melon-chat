import colors from "tailwindcss/colors";
import forms from "@tailwindcss/forms";
import { blackA, green, grass, mauve } from "@radix-ui/colors";

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
				...blackA,
				...green,
				...grass,
				...mauve,
			},
			keyframes: {
				overlayShow: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				slideDownAndFade: {
					from: { opacity: 0, transform: "translateY(-2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: "translateX(2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				slideUpAndFade: {
					from: { opacity: 0, transform: "translateY(2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: "translateX(-2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				contentShow: {
					from: {
						opacity: 0,
						transform: "translate(-50%, -48%) scale(0.96)",
					},
					to: {
						opacity: 1,
						transform: "translate(-50%, -50%) scale(1)",
					},
				},
			},
			animation: {
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",

				slideDownAndFade:
					"slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideLeftAndFade:
					"slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideUpAndFade:
					"slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideRightAndFade:
					"slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [forms()],
};
