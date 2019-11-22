import Docs from "./Document.js";
import Flow from "./Flow.js";
import Mail from "./Mail.js";
import Api from "./Api.js";
import Upload from "./Upload.js";
import Notify from "./Notify.js";
import Schedule from "./Schedule.js";

export default [
  { src: Flow, name: "flow" },
  { src: Api, name: "api" },
  { src: Upload, name: "upload" },
  { src: Schedule, name: "schedule" },
  { src: Notify, name: "notify" },
  { src: Mail, name: "mail" },
  {
    src: Docs,
    name: "docs"
  }
];
