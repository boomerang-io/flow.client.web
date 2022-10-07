import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import path from "path";

const projectRootDir = path.resolve(process.cwd());

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on) {
      on("file:preprocessor", vitePreprocessor(path.resolve(__dirname, "./vite.config.js")));
    },
  },
});
