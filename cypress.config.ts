import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import path from "path";

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:3000/BMRG_APP_ROOT_CONTEXT",
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on) {
      on("file:preprocessor", vitePreprocessor(path.resolve(__dirname, "./vite.config.ts")));
    },
  },
});
