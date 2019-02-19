//task category images
import boomerangIcon from "Assets/svg/boomerang_icon.svg";
import emailIcon from "Assets/svg/email_icon.svg";
import fileIcon from "Assets/svg/file_icon.svg";
import settingsIcon from "Assets/svg/settings_icon.svg";
//task name images
import getIcon from "Assets/svg/get_icon.svg";
import updateIcon from "Assets/svg/update_icon.svg";
import deployIcon from "Assets/svg/deploy_icon.svg";
import statusIcon from "Assets/svg/status_icon.svg";
import shellIcon from "Assets/svg/shell_icon.svg";
import enableIcon from "Assets/svg/enable_icon.svg";
import exportIcon from "Assets/svg/export_icon.svg";
import downloadIcon from "Assets/svg/download_icon.svg";
import editIcon from "Assets/svg/edit_icon.svg";

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

// TODO: confirm these actually map to icons
export const TASK_KEYS_TO_CARBON_ICON = {
  [TASK_KEYS.BOOMERANG]: "platform",
  [TASK_KEYS.COMMUNICATION]: "email",
  [TASK_KEYS.FILE_UTILITIES]: "file",
  [TASK_KEYS.UTILITIES]: "settings"
};

// TODO: finish mapping
const iconToTaskName = [
  {
    icon: "get",
    startsWith: ["get"],
    includes: ["read"]
  },
  {
    icon: "status",
    startsWithConditions: ["get", "validate"],
    includesConditions: ["approval"]
  }
];

/**
 *
 * @param {string} taskName
 * @param {string} categoryName
 * @return {string} Used in Carbon <Icon /> "name" prop
 */
export function iconMapping2(taskName, categoryName) {
  const taskNameFormatted = taskName.toLowerCase();
  const categoryFormatted = categoryName.toLowerCase();

  // Set default
  let iconName = TASK_KEYS_TO_CARBON_ICON[categoryFormatted];

  // Some will interate through array until true is returned
  iconToTaskName.some(iconConfig => {
    if (iconConfig.startsWithConditions.find(condition => taskNameFormatted.startsWith(condition))) {
      iconName = iconConfig.icon;
      return true;
    }
    if (iconConfig.includesConditions.find(condition => taskNameFormatted.includes(condition))) {
      iconName = iconConfig.icon;
      return true;
    }
  });

  return iconName;
}

// TODO: confirm the above works and we dont need this
export function iconMapping(taskName, categoryName) {
  let taskLower = taskName.toLowerCase();
  let categoryLower = categoryName.toLowerCase();

  if (taskLower.startsWith("get") || taskLower.startsWith("read")) {
    return getIcon;
  } else if (taskLower.startsWith("update") || taskLower.startsWith("sync")) {
    return updateIcon;
  } else if (taskLower.includes("deploy") || taskLower.startsWith("launch")) {
    return deployIcon;
  } else if (taskLower.startsWith("submit") || taskLower.startsWith("validate") || taskLower.includes("approval")) {
    return statusIcon;
  } else if (taskLower.startsWith("shell") || taskLower.startsWith("appcmd")) {
    return shellIcon;
  } else if (taskLower.startsWith("enable") || taskLower.startsWith("start") || taskLower.startsWith("activate")) {
    return enableIcon;
  } else if (taskLower.startsWith("export")) {
    return exportIcon;
  } else if (taskLower.includes("download")) {
    return downloadIcon;
  } else if (taskLower.includes("edit") || taskLower.includes("define") || taskLower.includes("modify")) {
    return editIcon;
  }

  //default case use task categories
  else {
    return TASK_KEYS_TO_ICON[categoryLower];
  }
}
