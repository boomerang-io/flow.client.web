import boomerangIcon from "Assets/svg/boomerang_icon.svg";
import emailIcon from "Assets/svg/email_icon.svg";
import fileIcon from "Assets/svg/file_icon.svg";
import settingsIcon from "Assets/svg/settings_icon.svg";

import getIcon from "Assets/svg/get_icon.svg";
import updateIcon from "Assets/svg/update_icon.svg";
import deployIcon from "Assets/svg/deploy_icon.svg";
import validateIcon from "Assets/svg/validate_icon.svg";

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

//Get,  Update, deploy

export function iconMapping(taskName, categoryName) {
  let taskLower = taskName.toLowerCase();
  let categoryLower = categoryName.toLowerCase();

  if (taskLower.includes("get")) {
    return getIcon;
  } else if (taskLower.includes("update")) {
    return updateIcon;
  } else if (taskLower.includes("deploy")) {
    return deployIcon;
  } else if (taskLower.includes("validate")) {
    return validateIcon;
  }

  //default case use categories
  else {
    return TASK_KEYS_TO_ICON[categoryLower];
  }
}
