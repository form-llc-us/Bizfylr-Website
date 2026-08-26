import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      "_legacy/**",
      ".next/**",
      "node_modules/**",
      "bizfylr-hostinger-*/**",
      "*-verify/**"
    ]
  },
  ...nextCoreWebVitals,
  ...nextTypescript
];

export default config;
