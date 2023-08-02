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
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/activity",
  },
  {
    name: "Actions",
    type: "link",
    icon: "Stamp",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/actions",
  },
  {
    disabled: true,
    name: "Schedules",
    type: "link",
    icon: "CalendarHeatMap",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/schedules",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/insights",
  },
  {
    type: "divider",
  },
  {
    name: "Task Manager",
    type: "link",
    icon: "TaskSettings",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/task-templates",
  },
  {
    name: "Parameters",
    type: "link",
    icon: "Parameter",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/parameters",
  },
  {
    name: "Manage Team",
    type: "link",
    icon: "SettingsAdjust",
    link: "/BMRG_APP_ROOT_CONTEXT/64b8d5a5040e205ee3383ab1/manage",
  },
  {
    name: "Admin",
    type: "menu",
    icon: "Settings",
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
        name: "Template Workflows",
        type: "link",
        link: "/BMRG_APP_ROOT_CONTEXT/admin/template-workflows",
      },
    ],
  },
];

export default flowNavigation;
