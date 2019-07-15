module.exports = (req, res, next) => {
  if (req.method === "POST" && req.originalUrl.startsWith("/flow/workflow/import")) {
    return res.status(200).send({});
  }
  next();
};
