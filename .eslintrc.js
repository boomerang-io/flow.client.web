module.exports = {
  extends: [
    "react-app",
    "plugin:cypress/recommended",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:testing-library/react",
  ],
  plugins: ["jest", "jest-dom", "jsx-a11y", "testing-library"],
  env: {
    "jest/globals": true,
    "cypress/globals": true,
  },
  globals: {
    shallow: true,
    render: true,
    mount: true,
    renderer: true,
    rtlRender: true,
    rtlRouterRender: true,
    rtlContextRouterRender: true,
  },
  overrides: [
    {
      files: ["cypress/**/*.spec.js"],
      rules: {
        "jest/expect-expect": "off",
      },
    },
  ],
};
