import downloadSVG from "Assets/svg/install.svg";
import emailSVG from "Assets/svg/email_icon.svg";
import boomerangSVG from "Assets/svg/apps-icon-launchpad.svg";

/*export const TASK_KEYS = {
  INGEST: "ingest",
  SLACK: "slack",
  SLEEP: "sleep",
  MAIL: "mail",
  ARTIFACTORYDOWNLOAD: "artifactoryDownload",
  CREATEFILE: "createFile",
  ARTIFACTORYUPLOAD: "artifactoryUpload"
};

export const TASK_KEYS_TO_ICON = {
  [TASK_KEYS.INGEST]: downloadIMG,
  [TASK_KEYS.SLACK]: emailIMG,
  [TASK_KEYS.SLEEP]: emailIMG,
  [TASK_KEYS.MAIL]: emailIMG,
  [TASK_KEYS.ARTIFACTORYDOWNLOAD]: emailIMG,
  [TASK_KEYS.CREATEFILE]: emailIMG,
  [TASK_KEYS.ARTIFACTORYUPLOAD]: emailIMG
};*/

export const TASK_KEYS = {
  BOOMERANG: "boomerang",
  COMMUNICATION: "communication",
  UTILITIES: "utilities"
};

export const TASK_KEYS_TO_ICON = {
  [TASK_KEYS.BOOMERANG]: boomerangSVG,
  [TASK_KEYS.COMMUNICATION]: emailSVG,
  [TASK_KEYS.UTILITIES]: downloadSVG
};
