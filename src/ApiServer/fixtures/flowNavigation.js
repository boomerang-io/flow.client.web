export default [
  {
    name: "Home",
    type: "link",
    icon: "Home16",
    link: "/",
  },
  {
    name: "Components",
    type: "link",
    icon: "App16",
    link: "/components",
  },
  {
    name: "Pipelines",
    type: "link",
    icon: "Rocket16",
    link: "/pipelines",
  },
  {
    name: "Scorecard",
    type: "link",
    icon: "ReportData16",
    link: "/scorecard",
  },

  {
    name: "Insights",
    type: "link",
    icon: "Analytics16",
    link: "/insights",
  },
  {
    name: "Lib",
    type: "link",
    icon: "Document16",
    link: "/components",
  },
  {
    name: "Policies",
    type: "link",
    icon: "Locked16",
    link: "/components",
  },
  {
    name: "Manage",
    type: "category",
    icon: "SettingsAdjust16",
    childLinks: [
      {
        name: "Policy Templates",
        type: "link",
        link: "/components",
      },
      {
        name: "Team Properties",
        type: "link",
        link: "/teams/null/properties",
      },
    ],
  },
  {
    name: "Workflows",
    type: "link",
    icon: "FlowData16",
    link: "/workflows",
  },
  {
    name: "Administer",
    type: "category",
    icon: "Settings16",
    childLinks: [
      {
        name: "Component Modes",
        type: "link",
        link: "/admin/component-modes",
      },
      {
        name: "Properties",
        type: "link",
        link: "/admin/properties",
      },
      {
        name: "SCM Repositories",
        type: "link",
        link: "/admin/repositories",
      },
      {
        name: "Settings",
        type: "link",
        link: "/admin/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/components",
      },
    ],
  },
];
