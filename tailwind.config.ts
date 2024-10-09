import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|chip|input|modal|select|table|popover|ripple|spinner|listbox|divider|scroll-shadow|checkbox|spacer).js"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--color-primary-dark) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: {
          primary: 'rgb(var(--color-background-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-background-secondary) / <alpha-value>)',
          overlay: 'rgb(var(--color-background-overlay) / <alpha-value>)',
          selected: 'rgb(var(--color-background-selected) / <alpha-value>)',
        },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--color-on-secondary) / <alpha-value>)',
        'on-background': 'rgb(var(--color-on-background) / <alpha-value>)',
        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        'error-light': 'rgb(var(--color-error-light) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
        },
        button: {
          primary: 'rgb(var(--color-button-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-button-hover) / <alpha-value>)',
        },
        chip: 'rgb(var(--color-chip) / <alpha-value>)',
        'chip-text': 'rgb(var(--color-chip-text) / <alpha-value>)',
        disabled: 'rgb(var(--color-disabled) / <alpha-value>)',
        table: {
          available: 'rgb(var(--color-table-available) / <alpha-value>)',
          occupied: 'rgb(var(--color-table-occupied) / <alpha-value>)',
          hover: 'rgb(var(--color-table-hover) / <alpha-value>)',
        },
        'remove-area': 'rgb(var(--color-remove-area) / <alpha-value>)',
        status: {
          preparing: 'rgb(var(--color-status-preparing) / <alpha-value>)',
          ready: 'rgb(var(--color-status-ready) / <alpha-value>)',
          delivered: 'rgb(var(--color-status-delivered) / <alpha-value>)',
          default: 'rgb(var(--color-status-default) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [nextui()],
};

export default config;