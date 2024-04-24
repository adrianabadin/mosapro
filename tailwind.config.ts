// const withMT = require("@material-tailwind/react/utils/withMT");
 
// module.exports = withMT({
//   content: ["./pages/**/*.{js,ts,jsx,tsx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}","./src/**/**/**"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
//});
import type { Config } from 'tailwindcss';
import withMT from '@material-tailwind/react/utils/withMT';

const config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        "mosapro-green":"#587c7f",
        "mosapro-gray":"#56595a"

      },
    
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
});

export default config;
