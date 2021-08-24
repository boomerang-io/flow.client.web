const flowNavigation = [
  {
    name: "Workflows",
    type: "link",
    icon: "FlowData16",
    link: "/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity16",
    link: "/activity",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter16",
    link: "/insights",
  },
  {
    name: "Management",
    type: "category",
    icon: "SettingsAdjust16",
    childLinks: [
      {
        name: "Team Parameters",
        type: "link",
        link: "/manage/team-parameters",
      },
      {
        name: "Team Tasks",
        type: "link",
        link: "/manage/task-templates",
      },
    ],
  },
  {
    name: "Admin",
    type: "category",
    icon: "Settings16",
    childLinks: [
      {
        name: "Parameters",
        type: "link",
        link: "/admin/parameters",
      },
      {
        name: "Team Quotas",
        type: "link",
        link: "/admin/quotas",
      },
      {
        name: "Settings",
        type: "link",
        link: "/admin/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/admin/task-templates",
      },
      {
        name: "System Workflows",
        type: "link",
        link: "/admin/system-workflows",
      },
    ],
  },
];

export default flowNavigation;
