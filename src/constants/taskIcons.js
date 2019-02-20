export const TASK_KEYS = {
  BOOMERANG: "boomerang",
  COMMUNICATION: "communication",
  UTILITIES: "utilities",
  FILE_UTILITIES: "file utilities"
};

export const TASK_KEYS_TO_CARBON_ICON = {
  [TASK_KEYS.BOOMERANG]: "services",
  [TASK_KEYS.COMMUNICATION]: "email",
  [TASK_KEYS.FILE_UTILITIES]: "document",
  [TASK_KEYS.UTILITIES]: "settings"
};

// Icon to task mapping
const iconToTaskName = [
  {
    icon: "search",
    startsWithConditions: ["get"],
    includesConditions: ["read"]
  },
  {
    icon: "checkmark--outline",
    startsWithConditions: ["submit", "validate"],
    includesConditions: ["approval"]
  },
  {
    icon: "restart",
    startsWithConditions: ["update", "sync"],
    includesConditions: []
  },
  {
    icon: "launch",
    startsWithConditions: ["launch"],
    includesConditions: ["deploy"]
  },
  {
    icon: "terminal",
    startsWithConditions: ["shell", "appcmd"],
    includesConditions: []
  },
  {
    icon: "power",
    startsWithConditions: ["enable", "start", "activate"],
    includesConditions: []
  },
  {
    icon: "back-to-top",
    startsWithConditions: ["export"],
    includesConditions: []
  },
  {
    icon: "download",
    startsWithConditions: [],
    includesConditions: ["download"]
  },
  {
    icon: "edit",
    startsWithConditions: [],
    includesConditions: ["edit", "define", "modify"]
  },
  {
    icon: "add--outline",
    startsWithConditions: ["create", "register"],
    includesConditions: []
  },
  {
    icon: "close--outline",
    startsWithConditions: ["stop", "cancel", "disable", "terminate"],
    includesConditions: []
  },
  {
    icon: "filter",
    startsWithConditions: ["configure"],
    includesConditions: []
  }
];

/**
 *
 * @param {string} taskName
 * @param {string} categoryName
 * @return {string} Used in Carbon <Icon /> "name" prop
 */
export function iconMapping(taskName, categoryName) {
  const taskNameFormatted = taskName.toLowerCase();
  const categoryFormatted = categoryName.toLowerCase();

  // Set default as matched category or fallback icon if none
  let iconName = TASK_KEYS_TO_CARBON_ICON[categoryFormatted] || "predictive";

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
    return false;
  });

  return iconName;
}
