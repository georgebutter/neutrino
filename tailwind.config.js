/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        serif: '"Source Serif Pro", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
      },
      colors: {
        'primary': 'var(--primary)',
        'success': 'var(--success)',
        'error': 'var(--error)',
        'warning': 'var(--warning)',
        'primaryfaded': 'var(--primary-faded)',
        'bg': 'var(--bg)',
        'text': 'var(--text)',
        'faded': 'var(--faded)',
        'border': 'var(--border)',
        'hover': 'var(--hover)',
        'fg': 'var(--fg)',
        'transparent': 'transparent',
      },
      cursor: {
        'col-resize': 'col-resize'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
