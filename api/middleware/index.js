const handleImportWorkflow = require("./handleImportWorkflow");
const singular = require("./singular");
const webhook = require("./webhook");

module.exports = [handleImportWorkflow, singular, webhook];
