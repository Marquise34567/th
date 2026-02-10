module.exports = {
  content: [
    // include app/pages/components at project root
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // include all files under src (common monorepo layouts)
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // prevent Tailwind from purging classes that are constructed dynamically
  safelist: [
    {
      pattern: /(bg|text|border|from|to)-(red|blue|green|purple|yellow|gray|indigo|pink|amber)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /(bg|text|border)-(primary|secondary|muted|accent)-(\d{3})?/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
