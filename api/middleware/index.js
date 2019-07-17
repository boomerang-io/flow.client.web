const handleImportWorkflow = require("./handleImportWorkflow");
const handleDeleteWorkflow = require("./handleDeleteWorkflow");
const singular = require("./singular");
const webhook = require("./webhook");

module.exports = [handleImportWorkflow, handleDeleteWorkflow, singular, webhook];
