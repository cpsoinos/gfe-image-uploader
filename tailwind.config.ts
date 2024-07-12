import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans", sans-serif'],
    },
    extend: {
      backgroundImage: {
        'radio-checked': `url(/radio-filled.svg)`,
      },
      boxShadow: {
        DEFAULT: '0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.06);',
      },
    },
  },
  plugins: [forms],
}

export default config
