"use strict";
/*eslint-env node*/
const path = require("path");
const dotenv = require("dotenv");

// Import env files
if (process.env.NODE_ENV === "development") {
  dotenv.config({
    path: path.join(__dirname, "config", ".env.local")
  });
}

// Constants from env file
const APP_ROOT = process.env.APP_ROOT;
const PORT = process.env.PORT;
const NEW_RELIC_APP_NAME = process.env.NEW_RELIC_APP_NAME;
const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY;
const HTML_HEAD_INJECTED_SCRIPTS = process.env.HTML_HEAD_INJECTED_SCRIPTS;
const BASE_LAUNCH_ENV_PATH = process.env.BASE_LAUNCH_ENV_PATH;
const BASE_APPS_ENV_PATH = process.env.BASE_APPS_ENV_PATH;
const SERVICE_TARGET = process.env.SERVICE_TARGET;
const DEPLOY_TARGET = process.env.DEPLOY_TARGET;

const BUILD_FOLDER = "build";

// Monitoring
if (NEW_RELIC_APP_NAME && NEW_RELIC_LICENSE_KEY) {
  require("newrelic");
}

// Express app
const express = require("express");
const app = express();

// Compression
const compression = require("compression");
app.use(compression());

// Logging
app.use(require("morgan")("dev"));

// Security middleware
const helmet = require("helmet");
app.use(helmet());
app.disable("x-powered-by");

// CORS
const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");

  // intercept OPTIONS method. For CORS support
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Create endpoint for the app to handle user authentication and serve application
const appRouter = express.Router();

appRouter.use("/failure", function(req, res, next) {
  res.send(
    "Something went wrong. Please try again. If the problem persists, please reach out to the Boomerang engineering team."
  );
});

// Next two route are needed for serving apps with client-side routing
// Do NOT return index file by default, as we need to do tranformations on it
// It will be returned on the second route, /*
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#serving-apps-with-client-side-routing
appRouter.use(
  "/",
  express.static(path.join(__dirname, BUILD_FOLDER), {
    index: false
  })
);

appRouter.get("/*", injectEnvDataIntoHTML);

app.use(APP_ROOT, appRouter);

// Start server on the specified port and binding host
app.listen(PORT || 3000, "0.0.0.0", function() {
  console.log("server starting on", PORT);
  console.log(`serving on root context: ${APP_ROOT}`);
});

// ***** Helpers functions *****

const serialize = require("serialize-javascript");
const fs = require("fs");

// Useful for adding arbitrary JSON data to the file based on environment
// https://medium.com/@housecor/12-rules-for-professional-javascript-in-2015-f158e7d3f0fc
// https://stackoverflow.com/questions/33027089/res-sendfile-in-node-express-with-passing-data-along
function injectEnvDataIntoHTML(req, res) {
  // Set the response type so browser interprets it as an html file
  res.type(".html");

  // Read in HTML file and add callback functions for EventEmitter events produced by ReadStream
  fs
    .createReadStream(path.join(__dirname, BUILD_FOLDER, "index.html"))
    .on("end", () => {
      res.end();
    })
    .on("error", e => console.log(e))
    .on("data", chunk => res.write(addHeadData(chunk)));
}

// Load dynamic data to be injected into the HEAD tag
const headDynamicData = {
  APP_ROOT,
  BASE_LAUNCH_ENV_PATH,
  BASE_APPS_ENV_PATH,
  DEPLOY_TARGET,
  SERVICE_TARGET
};

// Build up string of scripts to add to the HEAD tag
const headScriptsTags =
  HTML_HEAD_INJECTED_SCRIPTS &&
  HTML_HEAD_INJECTED_SCRIPTS.split(",").reduce(
    (acc, currentValue) => `${acc}<script src="${currentValue}"></script>`,
    ""
  );

/**
 * Convert buffer to string and replace closing head tag with env-specific data and additional scripts
 * Serialize data for security
 * https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0
 * @param {Buffer} chunk
 * @return {string} replaced string with data interopolated
 */
function addHeadData(chunk) {
  return chunk.toString().replace(
    "</head>",
    `<script>window._SERVER_DATA = ${serialize(headDynamicData, {
      isJSON: true
    })};</script>${headScriptsTags}</head>`
  );
}
