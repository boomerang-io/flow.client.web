/**
 * Carbon Icon icon name to the conditions it matches for
 * @todo: think about giving startsWith precedence over includes
 */
const iconToTaskNames = [
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
 * @return {string} Used in Carbon <Icon /> "name" prop
 */
export default function mapTaskNametoIcon(taskName) {
  const taskNameFormatted = taskName.toLowerCase();

  // Set default as fallback icon if none
  let iconName = "predictive";

  // Some will iterate through array until true is returned
  iconToTaskNames.some(iconConfig => {
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
