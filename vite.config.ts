/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import svgrPlugin from "vite-plugin-svgr";
import portForwardMap from "./src/portForwardMap";

const projectRootDir = resolve(__dirname);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/BMRG_APP_ROOT_CONTEXT/",
    build: {
      outDir: "build",
    },
    css: {
      devSourcemap: false,
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    plugins: [
      react(),
      eslint(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    resolve: {
      alias: [
        { find: "ApiServer", replacement: resolve(projectRootDir, "./src/ApiServer") },
        { find: "Assets", replacement: resolve(projectRootDir, "./src/Assets") },
        { find: "Components", replacement: resolve(projectRootDir, "./src/Components") },
        { find: "Config", replacement: resolve(projectRootDir, "./src/Config") },
        { find: "Constants", replacement: resolve(projectRootDir, "./src/Constants") },
        { find: "Features", replacement: resolve(projectRootDir, "./src/Features") },
        { find: "Hooks", replacement: resolve(projectRootDir, "./src/Hooks") },
        { find: "State", replacement: resolve(projectRootDir, "./src/State") },
        { find: "Styles", replacement: resolve(projectRootDir, "./src/Styles") },
        { find: "Types", replacement: resolve(projectRootDir, "./src/Types") },
        { find: "Utils", replacement: resolve(projectRootDir, "./src/Utils") },
        { find: "~@carbon", replacement: "@carbon" },
        { find: "~carbon-components", replacement: "carbon-components" },
        { find: "~carbon-components-react", replacement: "carbon-components-react" },
        { find: "~ibm-design-colors", replacement: "ibm-design-colors" },
        { find: "~normalize-scss", replacement: "normalize-scss" },
        { find: "~react-toastify", replacement: "react-toastify" },
        { find: "~tippy.js", replacement: "tippy.js" },
      ],
    },
    server: {
      port: 3000,
      proxy: mode === "portforward" ? createPortforwardConfig(portForwardMap, env.AUTH_JWT) : undefined,
    },
    test: {
      css: false,
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.tsx",
      coverage: {
        reporter: ["json"],
        include: [
          "**/src/Components/**/*.{js,jsx}",
          "**/src/Features/**/*.{js,jsx}",
          "**/src/Hooks/**/*.{js,jsx}",
          "**/src/State/**/*.{js,jsx}",
          "**/src/Utils/**/*.{js,jsx}",
        ],
      },
    },
  };
});
// Map service context paths to the local port that you have forwarded

function createPortforwardConfig(portForwardMap, jwt) {
  return Object.entries(portForwardMap).reduce((portForwardMap, [path, port]) => {
    portForwardMap[path] = {
      headers: { Authorization: `Bearer ${jwt}` },
      target: `http://localhost:${port}`,
      changeOrigin: true,
    };
    return portForwardMap;
  }, {});
}
