"use strict";

module.exports = (req, res, next) => {
  const _send = res.send;
  res.send = function(body) {
    if (require("url").parse(req.url, true).query["webhook"]) {
      return _send.call(this, JSON.stringify({ token: "testToken" }));
    }
    return _send.call(this, body);
  };
  next();
};
