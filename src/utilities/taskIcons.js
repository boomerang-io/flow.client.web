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

// The default "will-change: transform" prevents the icon from scaling correctly in the designer on zoom
const willChangeOverride = { willChange: "auto" };

/**
 * Carbon Icon icon name to the conditions it matches for
 * @todo: think about giving startsWith precedence over includes
 */
const iconToTaskNames = [
  {
    iconName: "Search",
    icon: <Search16 alt="Task node type get, read" style={willChangeOverride} />,
    startsWithConditions: ["get"],
    includesConditions: ["read"]
  },
  {
    iconName: "Checkmark",
    icon: <CheckmarkOutline16 alt="Task node type submit, validate, approval" style={willChangeOverride} />,
    startsWithConditions: ["submit", "validate"],
    includesConditions: ["approval"]
  },
  {
    iconName: "Restart",
    icon: <Restart16 alt="Task node type update, sync" style={willChangeOverride} />,
    startsWithConditions: ["update", "sync"],
    includesConditions: []
  },
  {
    iconName: "Launch",
    icon: <Launch16 alt="Task node type launch, deploy" style={willChangeOverride} />,
    startsWithConditions: ["launch"],
    includesConditions: ["deploy"]
  },
  {
    iconName: "Terminal",
    icon: <Terminal20 alt="Task node type shell, appcmd" style={willChangeOverride} />,
    startsWithConditions: ["shell", "appcmd"],
    includesConditions: []
  },
  {
    iconName: "Power",
    icon: <Power16 alt="Task node type enable, start, activate" style={willChangeOverride} />,
    startsWithConditions: ["enable", "start", "activate"],
    includesConditions: []
  },
  {
    iconName: "Export",
    icon: <BackToTop16 alt="Task node type export" style={willChangeOverride} />,
    startsWithConditions: ["export"],
    includesConditions: []
  },
  {
    iconName: "Download",
    icon: <Download16 alt="Task node type download" style={willChangeOverride} />,
    startsWithConditions: [],
    includesConditions: ["download"]
  },
  {
    iconName: "Edit",
    icon: <Edit16 alt="Task node type edit, define, modify" style={willChangeOverride} />,
    startsWithConditions: [],
    includesConditions: ["edit", "define", "modify"]
  },
  {
    iconName: "Add",
    icon: <AddAlt16 alt="Task node type create, register" style={willChangeOverride} />,
    startsWithConditions: ["create", "register"],
    includesConditions: []
  },
  {
    iconName: "Close",
    icon: <CloseOutline16 alt="Task node type stop, cancel, disable, terminate" style={willChangeOverride} />,
    startsWithConditions: ["stop", "cancel", "disable", "terminate"],
    includesConditions: []
  },
  {
    iconName: "Filter",
    icon: <Filter16 alt="Task node type configure" style={willChangeOverride} />,
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
  let iconImg = <Concept20 alt="Task node type concept" style={willChangeOverride} />;
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
