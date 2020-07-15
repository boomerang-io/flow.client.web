import React from "react";
import {
  AddAlt16,
  Api16,
  Fork16,
  Chat16,
  Code16,
  TrashCan16,
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
    name: "Add",
    Icon: ({ className, ...props }) => (
      <AddAlt16 alt="Task node type add" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "API/HTTP call",
    Icon: ({ className, ...props }) => (
      <Api16 alt="Task node type API/HTTP call" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Automated task",
    Icon: ({ className, ...props }) => (
      <Rocket16 alt="Task node type automated task" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Code",
    Icon: ({ className, ...props }) => (
      <Code16 alt="Task node type code" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Concept",
    Icon: ({ className, ...props }) => (
      <Idea16 alt="Task node type concept" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Delete",
    Icon: ({ className, ...props }) => (
      <TrashCan16 alt="Task node type delete" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Download",
    Icon: ({ className, ...props }) => (
      <Download16 alt="Task node type download" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Edit",
    Icon: ({ className, ...props }) => (
      <Edit16 alt="Task node type edit" style={willChangeOverride} className={className} {...props} />
    ),
  },

  {
    name: "Filter",
    Icon: ({ className, ...props }) => (
      <Filter16 alt="Task node type filter" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Launch",
    Icon: ({ className, ...props }) => (
      <Launch16 alt="Task node type launch" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Message",
    Icon: ({ className, ...props }) => (
      <Chat16 alt="Task node type message" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Power on/off",
    Icon: ({ className, ...props }) => (
      <Power16 alt="Task node type power on/off" style={willChangeOverride} className={className} {...props} />
    ),
  },

  {
    name: "Restart",
    Icon: ({ className, ...props }) => (
      <Restart16 alt="Task node type restart" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Search",
    Icon: ({ className, ...props }) => (
      <Search16 alt="Task node type get, read" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Switch",
    Icon: ({ className, ...props }) => (
      <Fork16 alt="Task node type switch" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Terminal",
    Icon: ({ className, ...props }) => (
      <Terminal20 alt="Task node type terminal" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Upload",
    Icon: ({ className, ...props }) => (
      <Upload16 alt="Task node type upload" style={willChangeOverride} className={className} {...props} />
    ),
  },
  {
    name: "Validate",
    Icon: ({ className, ...props }) => (
      <Task16 alt="Task node type validate" style={willChangeOverride} className={className} {...props} />
    ),
  },
];
