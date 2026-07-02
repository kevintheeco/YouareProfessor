import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

// 목적: 모듈 분할 후 배선 누락(no-undef)과 import 재할당 같은 실수를 정적으로 잡는 안전망
export default [
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        // CDN으로 로드되는 전역 라이브러리
        katex: "readonly",
        renderMathInElement: "readonly",
        PDFLib: "readonly",
        firebase: "readonly"
      }
    },
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "18" } },
    rules: {
      "react/jsx-no-undef": "error",
      "react/jsx-uses-vars": "error",
      "no-undef": "error",
      "no-import-assign": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "warn"
    }
  }
];
