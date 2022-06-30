module.exports = {
  extends: [
    "react-app",
    "plugin:cypress/recommended",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:testing-library/react",
  ],
  plugins: ["jest", "jest-dom", "jsx-a11y", "react-hooks", "testing-library"],
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
  ignorePatterns: ["public/*", "cypress/*"],
  settings: {
    jest: {
      version: 27,
    },
  },
};
