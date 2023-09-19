const flowNavigation = [
  {
    name: "Home",
    type: "link",
    icon: "Home",
    link: "/BMRG_APP_ROOT_CONTEXT/home",
  },
  {
    type: "divider",
  },
  {
    name: "Workflows",
    type: "link",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/activity",
  },
  {
    name: "Actions",
    type: "link",
    icon: "Stamp",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/actions",
  },
  {
    disabled: true,
    name: "Schedules",
    type: "link",
    icon: "CalendarHeatMap",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/schedules",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/insights",
  },
  {
    type: "divider",
  },
  {
    name: "Task Manager",
    type: "link",
    icon: "TaskSettings",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/task-templates",
  },
  {
    name: "Parameters",
    type: "link",
    icon: "Parameter",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/parameters",
  },
  {
    name: "Manage Team",
    type: "link",
    icon: "SettingsAdjust",
    link: "/BMRG_APP_ROOT_CONTEXT/admin-flowabl-io-personal-team/manage",
  },
  {
    name: "Admin",
    type: "menu",
    icon: "Settings",
    childLinks: [
      {
        name: "Teams",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/teams",
      },
      {
        name: "Users",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/users",
      },
      {
        name: "Global Parameters",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/parameters",
      },
      {
        name: "Global Tokens",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/tokens",
      },
      {
        name: "Settings",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/settings",
      },
      {
        name: "Task Manager",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/task-templates",
      },
      {
        name: "Template Workflows",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/system/template-workflows",
      },
    ],
  },
];

export default flowNavigation;
