import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  presets: [baseConfig],
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    // We need to append the path to the UI package to the content array so that
    // those classes are included correctly.
    "../../packages/ui/**/*.{jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
