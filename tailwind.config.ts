import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#FF6B35',
        navy: '#1A3A52',
        cream: '#FAF9F6',
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#374151',
            '--tw-prose-headings': '#1A3A52',
            '--tw-prose-links': '#FF6B35',
            '--tw-prose-code': '#1A3A52',
            '--tw-prose-pre-bg': '#f8fafc',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
