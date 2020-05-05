import React from "react";
import {
  AddAlt16,
  Api16,
  Fork16,
  Chat16,
  Code16,
  Delete16,
  Download16,
  Edit16,
  Filter16,
  Idea16,
  Launch16,
  Power16,
  Restart16,
  Rocket16,
  Search16,
  Task16,
  Terminal20,
  Upload16,
} from "@carbon/icons-react";

// The default "will-change: transform" prevents the icon from scaling correctly in the designer on zoom
const willChangeOverride = { willChange: "auto" };

export const taskIcons = [
  {
    iconName: "Add",
    icon: ({ className, imgProps }) => (
      <AddAlt16 alt="Task node type add" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "API/HTTP call",
    icon: ({ className, imgProps }) => (
      <Api16 alt="Task node type API/HTTP call" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Automated task",
    icon: ({ className, imgProps }) => (
      <Rocket16 alt="Task node type automated task" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Code",
    icon: ({ className, imgProps }) => (
      <Code16 alt="Task node type code" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Concept",
    icon: ({ className, imgProps }) => (
      <Idea16 alt="Task node type concept" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Delete",
    icon: ({ className, imgProps }) => (
      <Delete16 alt="Task node type delete" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Download",
    icon: ({ className, imgProps }) => (
      <Download16 alt="Task node type download" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Edit",
    icon: ({ className, imgProps }) => (
      <Edit16 alt="Task node type edit" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },

  {
    iconName: "Filter",
    icon: ({ className, imgProps }) => (
      <Filter16 alt="Task node type filter" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Launch",
    icon: ({ className, imgProps }) => (
      <Launch16 alt="Task node type launch" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Message",
    icon: ({ className, imgProps }) => (
      <Chat16 alt="Task node type message" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Power on/off",
    icon: ({ className, imgProps }) => (
      <Power16 alt="Task node type power on/off" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },

  {
    iconName: "Restart",
    icon: ({ className, imgProps }) => (
      <Restart16 alt="Task node type restart" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Search",
    icon: ({ className, imgProps }) => (
      <Search16 alt="Task node type get, read" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Switch",
    icon: ({ className, imgProps }) => (
      <Fork16 alt="Task node type switch" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Terminal",
    icon: ({ className, imgProps }) => (
      <Terminal20 alt="Task node type terminal" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Upload",
    icon: ({ className, imgProps }) => (
      <Upload16 alt="Task node type upload" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
  {
    iconName: "Validate",
    icon: ({ className, imgProps }) => (
      <Task16 alt="Task node type validate" style={willChangeOverride} className={className} {...imgProps} />
    ),
  },
];

/**
 * Carbon Icon icon name to the conditions it matches for
 * @todo: think about giving startsWith precedence over includes
 */
// const iconToTaskNames = [
//   {
//     iconName: "Search",
//     icon: <Search16 alt="Task node type get, read" style={willChangeOverride} />,
//     startsWithConditions: ["get"],
//     includesConditions: ["read"],
//   },
//   {
//     iconName: "Checkmark",
//     icon: <CheckmarkOutline16 alt="Task node type submit, validate, approval" style={willChangeOverride} />,
//     startsWithConditions: ["submit", "validate"],
//     includesConditions: ["approval"],
//   },
//   {
//     iconName: "Restart",
//     icon: <Restart16 alt="Task node type update, sync" style={willChangeOverride} />,
//     startsWithConditions: ["update", "sync"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Launch",
//     icon: <Launch16 alt="Task node type launch, deploy" style={willChangeOverride} />,
//     startsWithConditions: ["launch"],
//     includesConditions: ["deploy"],
//   },
//   {
//     iconName: "Terminal",
//     icon: <Terminal20 alt="Task node type shell, appcmd" style={willChangeOverride} />,
//     startsWithConditions: ["shell", "appcmd"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Power",
//     icon: <Power16 alt="Task node type enable, start, activate" style={willChangeOverride} />,
//     startsWithConditions: ["enable", "start", "activate"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Upload",
//     icon: <Upload16 alt="Task node type upload" style={willChangeOverride} />,
//     startsWithConditions: ["upload"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Download",
//     icon: <Download16 alt="Task node type download" style={willChangeOverride} />,
//     startsWithConditions: [],
//     includesConditions: ["download"],
//   },
//   {
//     iconName: "Edit",
//     icon: <Edit16 alt="Task node type edit, define, modify" style={willChangeOverride} />,
//     startsWithConditions: [],
//     includesConditions: ["edit", "define", "modify"],
//   },
//   {
//     iconName: "Add",
//     icon: <AddAlt16 alt="Task node type create, register" style={willChangeOverride} />,
//     startsWithConditions: ["create", "register"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Close",
//     icon: <CloseOutline16 alt="Task node type stop, cancel, disable, terminate" style={willChangeOverride} />,
//     startsWithConditions: ["stop", "cancel", "disable", "terminate"],
//     includesConditions: [],
//   },
//   {
//     iconName: "Filter",
//     icon: <Filter16 alt="Task node type configure" style={willChangeOverride} />,
//     startsWithConditions: ["configure"],
//     includesConditions: [],
//   },
// ];

/**
 *
 * @param {string} taskName
 * @return {string} Used in Carbon <Icon /> "name" prop
 */
// export default function mapTaskNametoIcon(taskName) {
//   const taskNameFormatted = taskName?.toLowerCase() ?? "";

//   // Set default as fallback icon if none
//   let iconImg = <Concept20 alt="Task node type concept" style={willChangeOverride} />;
//   let iconName = "Concept";

//   // Some will iterate through array until true is returned
//   iconToTaskNames.some((iconConfig) => {
//     if (iconConfig.startsWithConditions.find((condition) => taskNameFormatted.startsWith(condition))) {
//       iconImg = iconConfig.icon;
//       iconName = iconConfig.iconName;

//       return true;
//     }
//     if (iconConfig.includesConditions.find((condition) => taskNameFormatted.includes(condition))) {
//       iconImg = iconConfig.icon;
//       iconName = iconConfig.iconName;

//       return true;
//     }
//     return false;
//   });

//   return { iconName, iconImg };
// }
