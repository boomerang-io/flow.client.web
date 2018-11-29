"use strict";

module.exports = (req, res, next) => {
  const _send = res.send;
  res.send = function(body) {
    if (require("url").parse(req.url, true).query["webhook"] && req.method === "POST") {
      try {
        const json = JSON.parse(body);
        if (Array.isArray(json)) {
          if (json.length === 1) {
            return _send.call(this, "testToken");
          } else if (json.length === 0) {
            return _send.call(this, "{}", 404);
          }
        }
      } catch (e) {}
    }
    return _send.call(this, body);
  };
  next();
};
