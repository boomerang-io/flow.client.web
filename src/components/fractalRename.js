"use strict";

const path = require("path");
const fs = require("fs");

const CURR_DIR = process.cwd();

const listDir = (dir, fileList = []) => {
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = listDir(path.join(dir, file), fileList);
    } else {
      const parentDirName = path.basename(dir);
      let src = path.join(dir, file);
      if (/^index\.js$/.test(file)) {
        let newSrc = path.join(dir, `${parentDirName}.js`);
        fileList.push({
          oldSrc: src,
          newSrc: newSrc,
        });
      }
      if (/^index\.spec\.js$/.test(file)) {
        let newSrc = path.join(dir, `${parentDirName}.spec.js`);
        fileList.push({
          oldSrc: src,
          newSrc: newSrc,
        });
      }
    }
  });

  return fileList;
};

let foundFiles = listDir(CURR_DIR);
foundFiles.forEach((f) => {
  fs.renameSync(f.oldSrc, f.newSrc);
});

const recurisvelyCreateNewFile = (dir, fileList = []) => {
  let files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory() && file !== "__snapshots__") {
      fileList.push({
        path: `${fullPath}/index.js`,
        content: `export { default } from "./${path.basename(fullPath)}"`,
      });

      fileList = recurisvelyCreateNewFile(path.join(dir, file), fileList);
    }
  });

  return fileList;
};

let filesToWrite = recurisvelyCreateNewFile(CURR_DIR);
filesToWrite.forEach((f) => {
  fs.writeFileSync(f.path, f.content, "utf8");
});
