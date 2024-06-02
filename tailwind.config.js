const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      screens: {
        xs: "425px",
        lg: "1030px",
        "3xl": "1920px",
        "4xl": "3840px",
      },
      zIndex: {
        100: "100",
      },
      colors: {
        primary: "#376FD0",
        primaryDarker: "#2965cd",
        light: "#F7F9FC",
        lighter: "#fbfcfe",
        darkest: "#233044",
        dark: "#364B6A",
        darkish: "#3e567b",
        info: "#e5f6fd",
        error: "#C62828",
        success: "#1B5E20",
        successLighter: "#47ff6f",
        warning: "#E65100",
        grey: {
          50: "#C0C0C0",
          100: "#7D7B7B",
        },
        purple: "#9D6381",
        orange: "#F28123",
        green: "#314648",
        client: {
          light: "#EDECEC",
        },
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#376FD0",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#233044",
          "neutral-content": "#e5f6fd",
          "base-100": "#F7F9FC",
          "base-200": "#FFFFFF",
          "base-300": "#233044",
          "base-content": "#233044",
          info: "#e5f6fd",
          success: "#1B5E20",
          warning: "#E65100",
          error: "#C62828",
          "--btn-text-case": "normal",
        },
      },
    ],
  },
};
