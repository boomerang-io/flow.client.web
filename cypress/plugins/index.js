// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const path = require("path");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

const options = webpackPreprocessor.defaultOptions;
module.exports = (on) => {
  options.webpackOptions.module.rules.push({
    test: /\.tsx?$/,
    exclude: [/node_modules/],
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  });

  // Define your alias(es) here:
  options.webpackOptions["resolve"] = {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      ApiServer: path.resolve(process.cwd(), "src/ApiServer"),
      Config: path.resolve(process.cwd(), "src/Config"),
      Constants: path.resolve(process.cwd(), "src/Constants"),
    },
  };
  on("file:preprocessor", webpackPreprocessor(options));
};
