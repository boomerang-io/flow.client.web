const { defineConfig } = require("cypress");
const vite = require("vite");
const path = require("path");
const chokidar = require("chokidar");

const projectRootDir = path.resolve(process.cwd());

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents: vitePlugin,
  },
});

const cache = {};
function vitePlugin(on, config) {
  on("file:preprocessor", async (file) => {
    const { filePath, outputPath, shouldWatch } = file;

    if (cache[filePath]) {
      return cache[filePath];
    }

    const fileDir = path.dirname(outputPath);
    const fileName = path.basename(outputPath);
    const fileNameSansExtension = path.basename(outputPath, path.extname(outputPath));

    const viteConfig = {
      base: "/BMRG_APP_ROOT_CONTEXT/",
      define: {
        "process.env": {},
      },
      resolve: {
        alias: [
          { find: "ApiServer", replacement: path.resolve(projectRootDir, "./src/ApiServer") },
          { find: "Config", replacement: path.resolve(projectRootDir, "./src/Config") },
          { find: "Constants", replacement: path.resolve(projectRootDir, "./src/Constants") },
          { find: "Features", replacement: path.resolve(projectRootDir, "./src/Features") },
          { find: "Types", replacement: path.resolve(projectRootDir, "./src/Types") },
          { find: "Utils", replacement: path.resolve(projectRootDir, "./src/Utils") },
        ],
      },
      build: {
        emptyOutDir: false,
        minify: false,
        outDir: fileDir,
        sourcemap: false,
        write: true,
      },
    };

    if (fileName.endsWith(".html")) {
      viteConfig.build["rollupOptions"] = {
        input: {
          [fileNameSansExtension]: filePath,
        },
      };
    } else {
      viteConfig.build["lib"] = {
        entry: filePath,
        fileName: fileNameSansExtension,
        formats: ["cjs"],
        name: fileNameSansExtension,
      };
    }

    if (shouldWatch) {
      await vite.build(viteConfig);
      const watcher = chokidar.watch(filePath);
      file.on("close", () => {
        delete cache[filePath];
        watcher.close();
      });
      watcher.on("change", () => {
        vite.build(viteConfig).then(() => {
          file.emit("rerun");
        });
      });
    } else {
      await vite.build(viteConfig);
    }

    cache[filePath] = outputPath;
    return outputPath;
  });

  return config;
}
