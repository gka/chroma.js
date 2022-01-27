module.exports = {
  env: {
    browser: true,
    commonjs: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
  },
  extends: "eslint:recommended",
  globals: {},
  rules: {
    "no-sequences": "error",
  },
};
