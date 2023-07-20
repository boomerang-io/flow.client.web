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
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/workflows",
  },
  {
    name: "Activity",
    type: "link",
    icon: "Activity",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/activity",
  },
  {
    name: "Actions",
    type: "link",
    icon: "Stamp",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/actions",
  },
  {
    disabled: true,
    name: "Schedules",
    type: "link",
    icon: "CalendarHeatMap",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/schedules",
  },
  {
    name: "Insights",
    type: "link",
    icon: "ChartScatter",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/insights",
  },
  {
    type: "divider",
  },
  {
    name: "Task Manager",
    type: "link",
    icon: "TaskSettings",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/task-templates",
  },
  {
    name: "Parameters",
    type: "link",
    icon: "Parameter",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/parameters",
  },
  {
    name: "Manage Team",
    type: "link",
    icon: "SettingsAdjust",
    link: "/BMRG_APP_ROOT_CONTEXT/5e3a35ad8c222700018ccd39/manage",
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
