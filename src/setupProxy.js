const proxy = require("http-proxy-middleware");
const portForwardMap = require("./setupPortForwarding");
const REACT_APP_PORT_FORWARD = process.env.REACT_APP_PORT_FORWARD;

module.exports = function(app) {
  if (REACT_APP_PORT_FORWARD) {
    Object.entries(portForwardMap).forEach(([path, port]) => {
      if (!path) {
        return;
      }
      app.use(
        path,
        proxy({
          target: `http://localhost:${port}`,
          changeOrigin: true
        })
      );
    });
  }
};
