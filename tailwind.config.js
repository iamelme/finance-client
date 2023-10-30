/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/components/**/*.{html,tsx}",
		"./src/layout/**/*.{html,tsx}",
		"./src/ui/**/*.{html,tsx}",
	],
	theme: {
		extend: {},
		fontFamily: {
			sans: ['"Nunito Sans"', "sans-serif"],
		},
		fontSize: {
			xs: "0.6rem",
			sm: "0.75rem",
			base: ".8rem",
			lg: "1rem",
			xl: "1.25rem",
			"2xl": "1.563rem",
			"3xl": "1.953rem",
			"4xl": "2.441rem",
			"5xl": "3.052rem",
		},
	},
	plugins: [],
}
