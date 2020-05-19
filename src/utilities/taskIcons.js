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
    Icon: ({ className, ...props }) => (
      <AddAlt16 alt="Task node type add" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "API/HTTP call",
    Icon: ({ className, ...props }) => (
      <Api16 alt="Task node type API/HTTP call" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Automated task",
    Icon: ({ className, ...props }) => (
      <Rocket16 alt="Task node type automated task" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Code",
    Icon: ({ className, ...props }) => (
      <Code16 alt="Task node type code" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Concept",
    Icon: ({ className, ...props }) => (
      <Idea16 alt="Task node type concept" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Delete",
    Icon: ({ className, ...props }) => (
      <Delete16 alt="Task node type delete" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Download",
    Icon: ({ className, ...props }) => (
      <Download16 alt="Task node type download" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Edit",
    Icon: ({ className, ...props }) => (
      <Edit16 alt="Task node type edit" style={willChangeOverride} className={className} {...props} />
    ),
  },

  {
    iconName: "Filter",
    Icon: ({ className, ...props }) => (
      <Filter16 alt="Task node type filter" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Launch",
    Icon: ({ className, ...props }) => (
      <Launch16 alt="Task node type launch" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Message",
    Icon: ({ className, ...props }) => (
      <Chat16 alt="Task node type message" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Power on/off",
    Icon: ({ className, ...props }) => (
      <Power16 alt="Task node type power on/off" style={willChangeOverride} className={className} {...props} />
    ),
  },

  {
    iconName: "Restart",
    Icon: ({ className, ...props }) => (
      <Restart16 alt="Task node type restart" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Search",
    Icon: ({ className, ...props }) => (
      <Search16 alt="Task node type get, read" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Switch",
    Icon: ({ className, ...props }) => (
      <Fork16 alt="Task node type switch" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Terminal",
    Icon: ({ className, ...props }) => (
      <Terminal20 alt="Task node type terminal" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Upload",
    Icon: ({ className, ...props }) => (
      <Upload16 alt="Task node type upload" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    iconName: "Validate",
    Icon: ({ className, ...props }) => (
      <Task16 alt="Task node type validate" style={willChangeOverride} className={className} {...props} />
    ),
  },
];
