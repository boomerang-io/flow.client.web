const flowNavigation = [
  {
    name: "Workflows",
    type: "link",
    icon: "FlowData16",
    link: "/BMRG_APP_ROOT_CONTEXT/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity16",
    link: "/BMRG_APP_ROOT_CONTEXT/activity",
  },
  {
    name: "Actions",
    type: "link",
    icon: "Stamp16",
    link: "/BMRG_APP_ROOT_CONTEXT/actions",
  },
  {
    name: "Schedules",
    type: "link",
    icon: "CalendarHeatMap16",
    link: "/BMRG_APP_ROOT_CONTEXT/schedules",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter16",
    link: "/BMRG_APP_ROOT_CONTEXT/insights",
  },
  {
    name: "Management",
    type: "category",
    icon: "SettingsAdjust16",
    childLinks: [
      {
        name: "Team Approvers",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/manage/approver-groups",
      },
      {
        name: "Team Parameters",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/manage/team-parameters",
      },
      {
        name: "Team Tasks",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/manage/task-templates",
      },
      {
        name: "Team Tokens",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/manage/team-tokens",
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
        link: "/BMRG_APP_ROOT_CONTEXT/admin/teams",
      },
      {
        name: "Users",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/users",
      },
      {
        name: "Global Parameters",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/parameters",
      },
      {
        name: "Global Tokens",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/tokens",
      },
      {
        name: "Team Quotas",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/quotas",
      },
      {
        name: "Settings",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/task-templates",
      },
      {
        name: "System Workflows",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/system-workflows",
      },
    ],
  },
];

export default flowNavigation;
