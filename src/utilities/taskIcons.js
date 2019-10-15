import React from "react";
import {
  Concept20,
  Search16,
  CheckmarkOutline16,
  Restart16,
  Launch16,
  Terminal20,
  Power16,
  BackToTop16,
  Download16,
  Edit16,
  AddAlt16,
  CloseOutline16,
  Filter16
} from "@carbon/icons-react";

/**
 * Carbon Icon icon name to the conditions it matches for
 * @todo: think about giving startsWith precedence over includes
 */
const iconToTaskNames = [
  {
    iconName: "Search",
    icon: <Search16 alt="Task node type get, read" />,
    startsWithConditions: ["get"],
    includesConditions: ["read"]
  },
  {
    iconName: "Checkmark",
    icon: <CheckmarkOutline16 alt="Task node type submit, validate, approval" />,
    startsWithConditions: ["submit", "validate"],
    includesConditions: ["approval"]
  },
  {
    iconName: "Restart",
    icon: <Restart16 alt="Task node type update, sync" />,
    startsWithConditions: ["update", "sync"],
    includesConditions: []
  },
  {
    iconName: "Launch",
    icon: <Launch16 alt="Task node type launch, deploy" />,
    startsWithConditions: ["launch"],
    includesConditions: ["deploy"]
  },
  {
    iconName: "Terminal",
    icon: <Terminal20 alt="Task node type shell, appcmd" />,
    startsWithConditions: ["shell", "appcmd"],
    includesConditions: []
  },
  {
    iconName: "Power",
    icon: <Power16 alt="Task node type enable, start, activate" />,
    startsWithConditions: ["enable", "start", "activate"],
    includesConditions: []
  },
  {
    iconName: "Export",
    icon: <BackToTop16 alt="Task node type export" />,
    startsWithConditions: ["export"],
    includesConditions: []
  },
  {
    iconName: "Download",
    icon: <Download16 alt="Task node type download" />,
    startsWithConditions: [],
    includesConditions: ["download"]
  },
  {
    iconName: "Edit",
    icon: <Edit16 alt="Task node type edit, define, modify" />,
    startsWithConditions: [],
    includesConditions: ["edit", "define", "modify"]
  },
  {
    iconName: "Add",
    icon: <AddAlt16 alt="Task node type create, register" />,
    startsWithConditions: ["create", "register"],
    includesConditions: []
  },
  {
    iconName: "Close",
    icon: <CloseOutline16 alt="Task node type stop, cancel, disable, terminate" />,
    startsWithConditions: ["stop", "cancel", "disable", "terminate"],
    includesConditions: []
  },
  {
    iconName: "Filter",
    icon: <Filter16 alt="Task node type configure" />,
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
  let iconImg = <Concept20 alt="Task node type concept" />;
  let iconName = "Concept";

  // Some will iterate through array until true is returned
  iconToTaskNames.some(iconConfig => {
    if (iconConfig.startsWithConditions.find(condition => taskNameFormatted.startsWith(condition))) {
      iconImg = iconConfig.icon;
      iconName = iconConfig.iconName;

      return true;
    }
    if (iconConfig.includesConditions.find(condition => taskNameFormatted.includes(condition))) {
      iconImg = iconConfig.icon;
      iconName = iconConfig.iconName;

      return true;
    }
    return false;
  });

  return { iconName, iconImg };
}
