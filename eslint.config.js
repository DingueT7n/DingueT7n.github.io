export default [
  { ignores: ["dist/**", "node_modules/**"] },
  {
    files: ["src/**/*.{js,jsx}", "scripts/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-dupe-keys": "error",
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-sparse-arrays": "error",
    },
  },
];
