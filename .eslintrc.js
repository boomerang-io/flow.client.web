module.exports = {
  extends: ["react-app", "plugin:jest/recommended", "plugin:jsx-a11y/recommended", "plugin:cypress/recommended"],
  plugins: ["jest", "jsx-a11y", "cypress"],
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
    rtlReduxRender: true,
    rtlRouterRender: true,
    rtlReduxRouterRender: true,
    rtlContextRouterRender: true,
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "jsx-a11y/no-autofocus": 0,
      },
    },
    {
      files: ["cypress/**/*.spec.js"],
      rules: {
        "jest/expect-expect": "off",
      },
    },
  ],
};
