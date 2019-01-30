import boomerangIcon from "Assets/svg/boomerang_icon.svg";
import emailIcon from "Assets/svg/email_icon.svg";
import fileIcon from "Assets/svg/file_icon.svg";
import settingsIcon from "Assets/svg/settings_icon.svg";

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
  UTILITIES: "utilities",
  FILE_UTILITIES: "file utilities"
};

export const TASK_KEYS_TO_ICON = {
  [TASK_KEYS.BOOMERANG]: boomerangIcon,
  [TASK_KEYS.COMMUNICATION]: emailIcon,
  [TASK_KEYS.FILE_UTILITIES]: fileIcon,
  [TASK_KEYS.UTILITIES]: settingsIcon
};
