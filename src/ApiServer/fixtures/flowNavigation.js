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
      {
        name: "Team Tokens",
        type: "link",
        link: "/manage/team-tokens",
      },
    ],
  },
  {
    name: "Admin",
    type: "category",
    icon: "Settings16",
    childLinks: [
      {
        name: "Teams",
        type: "link",
        link: "/admin/teams",
      },
      {
        name: "Users",
        type: "link",
        link: "/admin/users",
      },
      {
        name: "Global Parameters",
        type: "link",
        link: "/admin/parameters",
      },
      {
        name: "Global Tokens",
        type: "link",
        link: "/admin/tokens",
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
