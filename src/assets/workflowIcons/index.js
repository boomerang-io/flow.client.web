import Docs from "./Document.js";
import Flow from "./Flow.js";
import Mail from "./Mail.js";
import Api from "./Api.js";
import Upload from "./Upload.js";
import Notify from "./Notify.js";
import Schedule from "./Schedule.js";

export default [
  { Icon: Flow, name: "flow" },
  { Icon: Api, name: "api" },
  { Icon: Upload, name: "upload" },
  { Icon: Schedule, name: "schedule" },
  { Icon: Notify, name: "notify" },
  { Icon: Mail, name: "mail" },
  {
    Icon: Docs,
    name: "docs",
  },
];
