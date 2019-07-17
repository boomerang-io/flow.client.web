module.exports = (req, res, next) => {
  if (req.method === "DELETE" && req.originalUrl.startsWith("/flow/workflow/")) {
    return res.status(200).send({});
  }
  next();
};
