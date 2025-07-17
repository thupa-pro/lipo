/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" && {
      "@fullhuman/postcss-purgecss": {
        content: [
          "./app/**/*.{js,ts,jsx,tsx}",
          "./components/**/*.{js,ts,jsx,tsx}",
          "./lib/**/*.{js,ts,jsx,tsx}",
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: ["html", "body"],
          deep: [/^radix-/, /^data-/, /^aria-/],
          greedy: [/^toast/, /^sonner/],
        },
      },
      cssnano: {
        preset: [
          "default",
          {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
          },
        ],
      },
    }),
  },
};

export default config;
