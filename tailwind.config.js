// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ["./src/**/*.{html,js}",  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
	darkMode: "class",
  plugins: [heroui()],
	mode: 'jit',
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
}

