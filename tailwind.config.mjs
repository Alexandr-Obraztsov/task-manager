/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/entities/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/features/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/shared/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'tg-theme-button': 'var(--tg-theme-button-color)',
				'tg-theme-button-text': 'var(--tg-theme-button-text-color)',
				'tg-theme-bg': 'var(--tg-theme-bg-color)',
				'tg-theme-text': 'var(--tg-theme-text-color)',
				'tg-theme-hint': 'var(--tg-theme-hint-color)',
				'tg-theme-link': 'var(--tg-theme-link-color)',
				'tg-theme-secondary-bg': 'var(--tg-theme-secondary-bg-color)',
			},
		},
	},
}
