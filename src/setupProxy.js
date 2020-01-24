const proxy = require("http-proxy-middleware");
const portForwardMap = require("./setupPortForwarding");

module.exports = function(app) {
  Object.entries(portForwardMap).forEach(([path, port]) => {
    app.use(
      path,
      proxy({
        target: `http://localhost:${port}`,
        changeOrigin: true
      })
    );
  });
};
