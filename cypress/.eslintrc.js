module.exports = {
  root: true,
  plugins: ["cypress"],
  extends: ["plugin:cypress/recommended"],
  env: {
    "cypress/globals": true,
  },
  overrides: [
    {
      files: ["**/*.spec.js"],
      rules: {
        "cypress/no-unnecessary-waiting": 0,
      },
    },
  ],
};
